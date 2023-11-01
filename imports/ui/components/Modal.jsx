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
      className="container lg:w-3/5 mx-auto backdrop-blur-sm overscroll-none fixed top-0 bottom-0 w-full z-50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-slate-100 w-full absolute bottom-0 overflow-scroll"
      >
        {children}
      </div>
    </div>
  );
}
