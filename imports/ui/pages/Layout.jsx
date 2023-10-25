import React from "react";
export const Layout = ({ children }) => {
  return (
    <div
      id="layout"
      className="container min-h-screen lg:w-3/5 mx-auto bg-slate-200 select-none"
    >
      {children}
    </div>
  );
};
