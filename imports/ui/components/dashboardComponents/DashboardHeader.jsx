import React, { useState } from "react";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { MonthSelector } from "./MonthSelector";

// Hooks
import { useIsDarkMode } from "../../hooks/useIsDarkMode";

export function DashboardHeader({ setActiveTab, activeTab, date }) {
  const [src, setSrc] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "/dark-mode-icon.png"
      : "/light-mode-icon.png"
  );

  useIsDarkMode({
    onDarkMode: () => setSrc("/dark-mode-icon.png"),
    onLightMode: () => setSrc("/light-mode-icon.png"),
  });

  return (
    <div className="page-header lg:w-3/5 mx-auto z-50 w-full flex flex-col justify-start items-stretch bg-primary-blue dark:bg-blue-800 rounded-b-xl shadow-sm">
      <div className="pb-2 z-50 shadow-sm">
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
