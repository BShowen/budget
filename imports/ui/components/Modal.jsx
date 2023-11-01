import React, { useEffect } from "react";
export function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.getElementsByTagName("body")[0].classList.add("overflow-hidden");
      return () =>
        document
          .getElementsByTagName("body")[0]
          .classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <div
      onClick={onClose}
      className="lg:w-3/5 w-full mx-auto fixed top-0 bottom-0 backdrop-blur-sm overscroll-none z-50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-slate-100 w-full relative h-full overflow-scroll"
      >
        {children}
      </div>
    </div>
  );
}
