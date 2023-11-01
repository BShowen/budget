import React from "react";

// Utils
import { dates } from "../util/dates";

export const BudgetDate = ({ date }) => {
  return (
    <div className="px-2 h-14 flex flex-row items-center">
      <h1 className="text-4xl text-white">
        {dates.format(date, { forPageHeader: true })}
      </h1>
    </div>
  );
};
