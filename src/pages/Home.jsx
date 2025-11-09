import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";
import Editor from "@monaco-editor/react";
import { IoCopy } from "react-icons/io5";
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
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  function extractCode(response) {
    //removing backtics from the code using regexx
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyCcg1zWoaUL3dcqWfRkp6DOhgCjwulA81k",
  });

  async function getResponse() {
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
    console.log(response.text);
    setCode(extractCode(response.text));
    setOutputScreen(true);
    setLoading(false);
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
    const fileName = "GenUI-Code.html"
    const blob  = new Blob([code], {type: 'text/plain'});
    let url =  URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully")

  }

  return (
    <>
      <Navbar />
      <div className="flex items-center px-[100px] justify-between gap-[30px]">
        <div className="left w-[50%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className="text-[25px] font-semibold sp-text">
            AI Component generator
          </h3>
          <p className="text-[gray] mt-2 text-[16px]">
            Describe your component and let AI will code for you.
          </p>

          <p className="text-[15px] font-[700] mt-4 ">FrameWork</p>
          <Select
            className="mt-2"
            options={options}
            // value={frameWork}
            styles={{
              control: (base) => ({
                ...base,

                backgroundColor: "#111",

                borderColor: "#333",

                color: "#fff",

                boxShadow: "none",

                "&:hover": { borderColor: "#555" },
              }),

              menu: (base) => ({
                ...base,

                backgroundColor: "#111",

                color: "#fff",
              }),

              option: (base, state) => ({
                ...base,

                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                  ? "#222"
                  : "#111",

                color: "#fff",

                "&:active": { backgroundColor: "#444" },
              }),

              singleValue: (base) => ({ ...base, color: "#fff" }),

              placeholder: (base) => ({ ...base, color: "#aaa" }),

              input: (base) => ({ ...base, color: "#fff" }),
            }}
            onChange={(e) => {
              setFrameWork(e.value);
              console.log(e.value);
            }}
          />
          <p className="text-[15px] font-[700] mt-5 ">
            Describe your component
          </p>
          <textarea
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            value={prompt}
            className="w-full min-h-[200px] rounded-xl bg-[#090908] mt-3 p-[10px]"
            placeholder="describe your component in detail and let ai will code for your component"
          ></textarea>

          <div className="flex items-center justify-between">
            <p className="text-[gray]">
              Click on generate button to generate your code
            </p>

            <button
              onClick={getResponse}
              className="generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-bl from-slate-950  to-purple-700 mt-3 ml-auto px-[20px] gap-[10px] transition-all hover:opacity-[.8]"
            >
              <i>
                <BsStars />
              </i>
              {loading === true ? (
                <>
                  <ClipLoader className="text-[20px] " />
                </>
              ) : (
                ""
              )}
              Generate Component
            </button>
          </div>
        </div>
        <div className="right relative mt-2 left w-[50%] h-[80vh] bg-[#141319] rounded-xl ">
          {outputScreen === false ? (
            <>
              
              <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                <div className="circle p-[20px] w-[70px] flex items-center justify-center text-[25px] h-[70px] rounded-[50%] bg-gradient-to-bl from-slate-950  to-purple-700">
                  <FaCode />
                </div>
                <p className="text-[16px] text-[gray] mt-3">
                  your component & code will appear here
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="top bg-[#17171C] w-full h-[60px]  flex items-center gap-[15px] px-[20px]">
                <button
                  onClick={() => {
                    setTab(1);
                  }}
                  className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${
                    tab === 1 ? "bg-[#333]" : ""
                  }`}
                >
                  {" "}
                  Code
                </button>
                <button
                  onClick={() => {
                    setTab(2);
                  }}
                  className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${
                    tab === 2 ? "bg-[#333]" : ""
                  }`}
                >
                  Preview
                </button>
              </div>

              <div className="top-2 bg-[#17171C] w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
                <div className="left">
                  <p className="font-bold">Code Editor</p>
                </div>

                <div className="right flex items-center gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button className="copy w-[40px] h-[40px] rounded-xl  border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}>
                        <IoCopy />
                      </button>
                      <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}>
                        <PiExportFill />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="copy w-[40px] h-[40px] rounded-xl  border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" >
                        <ImNewTab />
                      </button>
                      <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]">
                        <LuRefreshCw />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="editor h-full bg-white-500">
                {tab === 1 ? (
                  <>
                    <Editor
                      value={code}
                      height="100%"
                      theme="vs-dark"
                      defaultLanguage="html"
                    />
                  </>
                ) : (
                  <>
                    <iframe srcDoc={code} className="preview w-full h-full bg-white text-black flex items-center justify-center"></iframe>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
