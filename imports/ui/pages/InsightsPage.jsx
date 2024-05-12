import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import { Insights } from "../components/Insights";

// Icons
import { IoIosArrowBack } from "react-icons/io";

export function InsightsPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="page-header w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-primary-blue dark:bg-blue-800 shadow-sm text-white">
        <div className="flex flex-row items-center p-1 h-11">
          <Link
            className="text-xl font-bold flex flex-row justify-start items-center w-24 lg:hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack className="text-2xl" /> Back
          </Link>
        </div>
      </div>
      <div className="pt-12 px-2 height-full">
        <Insights />
      </div>
    </>
  );
}
