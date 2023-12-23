import React from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { LuChevronLeft } from "react-icons/lu";

export function AccountPageLayout({ children }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-start items-stretch relative">
      <div className="absolute top-1 left-1 flex flex-row justify-start items-center px-2 py-2">
        <LuChevronLeft
          className="text-2xl text-gray-700 border-2 rounded-md border-gray-300 h-7 w-7 md:hover:cursor-pointer bg-gray-100"
          onClick={() => navigate(-1)}
        />
      </div>
      {children}
    </div>
  );
}
