import React, { useState } from "react";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { MonthSelector } from "./MonthSelector";

// Hooks
import { useIsDarkMode } from "../../hooks/useIsDarkMode";

export function DashboardHeader({ setActiveTab, activeTab, timestamp }) {
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
    <div className="w-full z-50 fixed top-0 padding-top-safe-area bg-primary-blue dark:bg-blue-800 rounded-b-xl shadow-sm">
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
