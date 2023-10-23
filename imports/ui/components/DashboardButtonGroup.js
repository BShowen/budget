import React from "react";

export const DashboardButtonGroup = ({ active, setActiveTab }) => {
  const buttonList = ["Planned", "Spent", "Remaining"].map((btnText) => {
    return (
      <button
        key={btnText}
        // onClick={() => setActiveTab(i)}
        onClick={setActiveTab.bind(null, btnText.toLowerCase())}
        className={`rounded-md text-white font-bold ${
          active === btnText.toLowerCase() ? "bg-sky-500" : ""
        }`}
      >
        {btnText}
      </button>
    );
  });

  return (
    <div className="w-full grid grid-cols-3 gap-1 p-1 bg-sky-700 rounded-md h-9">
      {buttonList}
    </div>
  );
};
