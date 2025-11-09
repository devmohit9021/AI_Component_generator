import React from 'react'
import { AiFillSun } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

const Navbar = () => {
  return (
    <>
    <div className='nav flex items-center justify-between px-[100px] h-[90px] border-b-[1px] border-gray-800'>
        <div className="logo">
          <h3 className='text-[25px] font-[700] sp-text '>GenUI</h3>
        </div>
        <div className='icons flex items-center gap-[15px]'>
          <div className="icon"><AiFillSun /></div>
          <div className="icon"><FaUser /></div>
          <div className="icon"><IoIosSettings /></div>

        </div>
    </div>
    </>
  )
}

export default Navbar