import React from "react";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { MonthSelector } from "./MonthSelector";

export function DashboardHeader({ setActiveTab, activeTab, date }) {
  const year = date.toLocaleString("en-US", { year: "numeric" });
  const currentMonth = date.toLocaleString("en-US", { month: "long" });

  return (
    <div className="page-header lg:w-3/5 mx-auto z-50 w-full flex flex-col justify-start items-stretch bg-header rounded-b-xl overflow-hidden shadow-sm">
      <div className="pb-2 z-50 shadow-sm text-white">
        <div className="w-full flex flex-row justify-between items-stretch h-14">
          <div className="ms-2 flex flex-row justify-center items-center">
            <img src="/icon.png" width="40px" />
            <div
              className="flex flex-col justify-center items-stretch font-medium
             text-xs"
            >
              <p>Dough</p>
              <p>Tracker</p>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center px-2 gap-2">
            <h1 className="text-3xl font-bold lg:hover:cursor-pointer w-max">
              {currentMonth} <span className="font-thin">{year}</span>
            </h1>
            <MonthSelector currentDate={date} />
          </div>
        </div>
        <div className="w-full px-1">
          <DashboardButtonGroup
            active={activeTab}
            setActiveTab={(activeTab) => setActiveTab(activeTab)}
          />
        </div>
      </div>
    </div>
  );
}
