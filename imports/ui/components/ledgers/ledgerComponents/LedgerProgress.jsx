import React from "react";

export const LedgerProgress = (options) => {
  const percent = options.percent < 0 ? 0 : options.percent;
  const bgColor =
    percent <= 100
      ? "bg-ledger-progress-bg-color-good"
      : "bg-ledger-progress-bg-color-bad";
  return (
    <div className="w-full h-7 absolute left-0 right-0 overflow-hidden z-0 flex flex-row justify-start items-center">
      <div
        className={`${bgColor} h-full transition-width duration-300 ease-in-out rounded-lg`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};
