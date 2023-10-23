import React from "react";

export const BudgetDate = ({ date }) => {
  return (
    <div className="px-2 h-14 flex flex-row items-center">
      <h1 className="text-4xl text-white">
        {date.toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        })}
      </h1>
    </div>
  );
};
