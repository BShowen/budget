import React, { useEffect } from "react";

export function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document
        .getElementsByTagName("body")[0]
        .classList.toggle("overflow-hidden");
      return () =>
        document
          .getElementsByTagName("body")[0]
          .classList.toggle("overflow-hidden");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <div
      onClick={onClose}
      className="lg:w-3/5 mx-auto backdrop-blur-sm overscroll-contain fixed top-0 bottom-0 w-full z-50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-slate-100 w-full rounded-t-xl absolute bottom-0  overflow-scroll"
      >
        {children}
        <div className="flex flex-row justify-center items-center w-full p-2">
          <h2
            onClick={onClose}
            className="inline-block text-center text-rose-500 font-bold text-lg"
          >
            Cancel
          </h2>
        </div>
      </div>
    </div>
  );
}
