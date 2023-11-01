import React, { useContext } from "react";

// Icons
import { IoPersonCircleSharp } from "react-icons/io5";
import { TfiAngleDown } from "react-icons/tfi";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { BudgetDate } from "./BudgetDate";

// Context
import { RootContext } from "../pages/Splash";

export function DashboardHeader({ setActiveTab, activeTab, date }) {
  const { setDate } = useContext(RootContext);
  return (
    <div className="bg-sky-500 pb-3 shadow-md rounded-b-md">
      <div className="w-full flex flex-row flex-nowrap items-center justify-between py-1">
        <div className="flex flex-row justify-center items-center">
          <BudgetDate date={date} />
          <TfiAngleDown className="text-white text-3xl lg:hover:cursor-pointer" />
        </div>
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
