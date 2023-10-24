import React from "react";

export const Progress = ({ percent, overrideBgColor }) => {
  const defaultBgColor = "bg-sky-500/30";
  const bgColor = overrideBgColor ? overrideBgColor : defaultBgColor;
  return (
    <div className="w-full h-8 absolute left-0 right-0 rounded-md overflow-hidden">
      <div
        className={`${bgColor} h-full transition-width duration-300 ease-in-out delay-[10ms]`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};
