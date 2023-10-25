import React from "react";

// Icons
import { IoPersonCircleSharp } from "react-icons/io5";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { BudgetDate } from "./BudgetDate";

export function DashboardHeader({ setActiveTab, activeTab, date }) {
  return (
    <div className="bg-sky-500 pb-3 sticky top-0 shadow-md rounded-b-md z-50">
      <div className="w-full flex flex-row flex-nowrap items-center justify-between py-1">
        <BudgetDate date={date} />
        <IoPersonCircleSharp className="text-5xl me-2 text-sky-700" />
      </div>
      <div className="w-full px-1 py-4">
        <DashboardButtonGroup
          active={activeTab}
          setActiveTab={(activeTab) => setActiveTab(activeTab)}
        />
      </div>
    </div>
  );
}
