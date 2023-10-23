import React from "react";

export const Progress = ({ percent }) => {
  return (
    <div className="w-full h-8 absolute left-0 right-0 rounded-md overflow-hidden">
      <div
        className="bg-sky-500/30 h-full transition-width duration-300 ease-in-out delay-[10ms]"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};
