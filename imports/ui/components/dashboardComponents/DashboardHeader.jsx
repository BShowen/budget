import React, { useContext } from "react";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { MonthSelector } from "./MonthSelector";

import { RootContext } from "../../layouts/AppContent";

export function DashboardHeader({ setActiveTab, activeTab, timestamp }) {
  const { theme } = useContext(RootContext);
  const src = theme == "light" ? "/light-mode-icon.png" : "/dark-mode-icon.png";

  return (
    <div className="w-full z-50 fixed top-0 padding-top-safe-area bg-main-nav-bg-color rounded-b-xl shadow-sm">
      <div className="flex flex-col justify-start items-stretch pb-2">
        <div className="w-full flex flex-row justify-between items-stretch h-12 text-white">
          <div className="ms-2 flex flex-row justify-center items-center">
            <img src={src} width="40px" />
            <div
              className="flex flex-col justify-center items-stretch font-medium
             text-xs"
            >
              <p>Dough</p>
              <p>Tracker</p>
            </div>
          </div>

          <MonthSelector currentTimestamp={timestamp} />
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
