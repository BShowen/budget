import React from "react";

export function SubmitButton({ isFormValid, onClick }) {
  const handleClick = () => {
    if (isFormValid) {
      setTimeout(() => {
        onClick();
      }, 100);
    } else {
      alert("Please check the form and try again.");
    }
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <button
        className="w-full h-8 transition-all px-3 border-none bg-green-600/80 rounded-md lg:hover:cursor-pointer text-white active:bg-green-700 font-semibold flex flex-row justify-center items-center"
        onClick={handleClick}
        type="button"
      >
        Add
      </button>
    </div>
  );
}
