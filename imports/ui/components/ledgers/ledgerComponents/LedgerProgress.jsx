import React from "react";

export const LedgerProgress = (options) => {
  const percent = options.percent < 0 ? 0 : options.percent;
  const bgColor =
    percent <= 100 ? "progress-bg-color-good" : "progress-bg-color-bad";
  return (
    <div className="w-full h-8 absolute left-0 right-0 rounded-md overflow-hidden z-10 flex flex-row justify-start items-center">
      <div
        className={`${bgColor} h-full transition-width duration-300 ease-in-out rounded-md`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};
