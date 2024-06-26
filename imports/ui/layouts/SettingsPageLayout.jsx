import React from "react";
import { Outlet } from "react-router-dom";

// Components
import { NavHeader } from "../components/NavHeader";

export function SettingsPageLayout() {
  return (
    <>
      <NavHeader text="Settings" page="account-page" />
      <div className="pt-14 p-2 flex flex-col justify-start items-stretch gap-3">
        <Outlet />
      </div>
    </>
  );
}
