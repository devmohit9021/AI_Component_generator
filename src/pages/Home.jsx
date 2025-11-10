import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";
import Editor from "@monaco-editor/react";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportFill } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { LuRefreshCw } from "react-icons/lu";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML+CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    {
      value: "html-tailwind-bootstrap",
      label: "HTML + tailwind CSS + Bootstrap",
    },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]); // keep as object for react-select
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  function extractCode(response) {
    // remove fenced code blocks if present
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_API_KEY,
  });

  async function getResponse() {
    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
The code must be clean, well-structured, and easy to understand.  
Optimize for SEO where applicable.  
Focus on creating a modern, animated, and responsive UI design.  
Include high-quality hover effects, shadows, animations, colors, and typography.  
Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
Do NOT include explanations, text, comments, or anything else besides the code.   
And give the whole code in a single HTML file.`,
      });

      // Some SDKs return objects with a text() method instead of .text
      const text = typeof response.text === "function" ? response.text() : response.text;
      const cleaned = extractCode(text);
      setCode(cleaned);
      setOutputScreen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate component");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied successfully");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to Copy");
    }
  };

  const downloadFile = () => {
    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully");
  };

  return (
    <>
      <Navbar />

      {/* Page container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Responsive two-column layout that stacks on small screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-6">
          {/* LEFT */}
          <div className="w-full rounded-xl bg-[#141319] p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold sp-text">AI Component generator</h3>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Describe your component and let AI code it for you.
            </p>

            <p className="text-sm sm:text-base font-bold mt-4">Framework</p>
            <Select
              className="mt-2 text-black"
              options={options}
              value={frameWork}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#111",
                  borderColor: "#333",
                  color: "#fff",
                  boxShadow: "none",
                  minHeight: 42,
                  "&:hover": { borderColor: "#555" },
                }),
                menu: (base) => ({ ...base, backgroundColor: "#111", color: "#fff" }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? "#333" : state.isFocused ? "#222" : "#111",
                  color: "#fff",
                  "&:active": { backgroundColor: "#444" },
                }),
                singleValue: (base) => ({ ...base, color: "#fff" }),
                placeholder: (base) => ({ ...base, color: "#aaa" }),
                input: (base) => ({ ...base, color: "#fff" }),
              }}
              onChange={(opt) => setFrameWork(opt)}
            />

            <p className="text-sm sm:text-base font-bold mt-5">Describe your component</p>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className="w-full min-h-[160px] sm:min-h-[200px] rounded-xl bg-[#090908] mt-3 p-3 text-sm sm:text-base"
              placeholder="Describe your component in detail and AI will code it"
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 mt-3">
              <p className="text-gray-400 text-sm">Click generate to get your code</p>

              <button
                disabled={loading || !prompt.trim()}
                onClick={getResponse}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-0 bg-gradient-to-bl from-slate-950 to-purple-700 px-4 py-3 text-sm sm:text-base transition-opacity disabled:opacity-60 hover:opacity-90"
              >
                {loading ? (
                  <ClipLoader color="white" size={18} />
                ) : (
                  <i className="text-lg">
                    <BsStars />
                  </i>
                )}
                <span>Generate Component</span>
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative w-full rounded-xl bg-[#141319] min-h-[55vh] sm:min-h-[60vh] lg:h-[80vh]">
            {!outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center p-6 text-center">
                <div className="p-5 w-16 h-16 flex items-center justify-center text-2xl rounded-full bg-gradient-to-bl from-slate-950 to-purple-700">
                  <FaCode />
                </div>
                <p className="text-sm sm:text-base text-gray-400 mt-3">
                  Your component & code will appear here
                </p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="sticky top-0 z-10 bg-[#17171C] w-full h-12 flex items-center gap-3 px-3 sm:px-5 rounded-t-xl">
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 p-2 rounded-lg text-sm sm:text-base transition ${tab === 1 ? "bg-[#333]" : "bg-transparent"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 p-2 rounded-lg text-sm sm:text-base transition ${tab === 2 ? "bg-[#333]" : "bg-transparent"}`}
                  >
                    Preview
                  </button>
                </div>

                {/* Toolbar */}
                <div className="bg-[#17171C] w-full h-12 flex items-center justify-between gap-3 px-3 sm:px-5">
                  <p className="font-bold text-sm sm:text-base">Code Editor</p>

                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button
                          className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center transition hover:bg-[#333]"
                          onClick={copyCode}
                          title="Copy"
                        >
                          <IoCopy />
                        </button>
                        <button
                          className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center transition hover:bg-[#333]"
                          onClick={downloadFile}
                          title="Export"
                        >
                          <PiExportFill />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center transition hover:bg-[#333]"
                          onClick={() => setIsNewTabOpen(true)}
                          title="Open full screen"
                        >
                          <ImNewTab />
                        </button>
                        <button
                          className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center transition hover:bg-[#333]"
                          onClick={() => setCode((prev) => prev)}
                          title="Refresh preview"
                        >
                          <LuRefreshCw />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Editor / Preview area */}
                <div className="w-full" style={{ height: "calc(100% - 96px)" }}>
                  {tab === 1 ? (
                    <Editor value={code} height="100%" theme="vs-dark" defaultLanguage="html"/>
                  ) : (
                    <iframe
                      title="preview"
                      srcDoc={code}
                      className="w-full h-full bg-white text-black"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Preview (mobile-friendly) */}
      {isNewTabOpen && (
        <div className="fixed inset-0 z-50 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-14 flex items-center justify-between px-4 sm:px-5 bg-gray-100">
            <p className="font-bold">Preview</p>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200"
            >
              <IoCloseSharp />
            </button>
          </div>
          <iframe title="preview-full" srcDoc={code} className="w-full" style={{ height: "calc(100vh - 56px)" }} />
        </div>
      )}
    </>
  );
};

export default Home;
