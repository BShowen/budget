import React from "react";
import { useNavigate } from "react-router-dom";

export function CancelButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    setTimeout(() => {
      navigate(-1);
    }, 100);
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <button
        className="w-full h-8 transition-all px-3 bg-red-600/80 rounded-md lg:hover:cursor-pointer text-white active:bg-red-900 font-semibold flex flex-row justify-center items-center"
        onClick={handleClick}
        type="button"
      >
        Cancel
      </button>
    </div>
  );
}
