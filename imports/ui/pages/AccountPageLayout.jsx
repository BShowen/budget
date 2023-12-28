import React from "react";
import { useNavigate, Link } from "react-router-dom";

// Icons
import { IoIosArrowBack } from "react-icons/io";

export function AccountPageLayout({ children, header }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="page-header w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-sky-500 shadow-sm text-white">
        <div className="flex flex-row items-center p-1 h-11">
          <Link
            className="text-xl font-bold flex flex-row justify-start items-center w-24 lg:hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack className="text-2xl" /> Back
          </Link>
        </div>
      </div>
      <div className="pt-12 p-2 flex flex-col justify-start items-stretch gap-3 text-gray-700">
        {children}
      </div>
    </>
  );
}
