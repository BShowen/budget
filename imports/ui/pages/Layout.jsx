import React from "react";
export const Layout = ({ children }) => {
  return (
    <div id="layout" className="lg:w-3/5 mx-auto bg-slate-100 select-none">
      {children}
    </div>
  );
};
