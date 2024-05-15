import React from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { IoIosArrowBack } from "react-icons/io";

export function BackButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    setTimeout(() => {
      navigate(-1);
    }, 100);
  };
  return (
    <button
      className="border border-slate-300 dark:border-dark-mode-bg-3 rounded-md w-8 h-8 flex flex-row justify-center items-center transition-all active:bg-dark-mode-bg-3"
      type="button"
      onClick={handleClick}
    >
      <IoIosArrowBack className="dark:text-dark-mode-text-1 text-xl" />
    </button>
  );
}
