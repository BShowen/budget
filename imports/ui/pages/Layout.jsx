import React from "react";
export const Layout = ({ children }) => {
  return (
    <>
      <div className=" p-1 mx-auto">
        <div className="bg-sky-500 absolute top-0 left-0 right-0 -z-40 h-52" />
        <div className="bg-slate-100 absolute bottom-0 left-0 right-0 top-0 -z-50 " />
        {children}
      </div>
    </>
  );
};
