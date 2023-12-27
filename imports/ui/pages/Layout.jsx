import React from "react";
import { Outlet } from "react-router-dom";

// Components
import { FooterNav } from "../components/FooterNav.jsx";
export const Layout = () => {
  return (
    <div
      id="layout"
      className="lg:w-3/5 mx-auto bg-gray-100 select-none padding-safe-area-top"
    >
      <Outlet />
      <FooterNav />
    </div>
  );
};
