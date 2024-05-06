import React from "react";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { MonthSelector } from "./MonthSelector";

export function DashboardHeader({ setActiveTab, activeTab, date }) {
  return (
    <div className="page-header lg:w-3/5 mx-auto z-50 w-full flex flex-col justify-start items-stretch bg-header rounded-b-xl shadow-sm">
      <div className="pb-2 z-50 shadow-sm text-white">
        <div className="w-full flex flex-row justify-between items-stretch h-12">
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

          <MonthSelector currentDate={date} />
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
