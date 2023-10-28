import React from "react";

export const Progress = (options) => {
  const percent = options.percent < 0 ? 0 : options.percent;
  const bgColor = percent <= 100 ? "bg-sky-500/30" : "bg-rose-500/30";
  return (
    <div className="w-full h-8 absolute left-0 right-0 rounded-md overflow-hidden">
      <div
        className={`${bgColor} h-full transition-width duration-300 ease-in-out delay-[10ms]`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};
