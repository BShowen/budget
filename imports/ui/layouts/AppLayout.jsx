import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

// Components
import { FooterNav } from "../components/FooterNav.jsx";
export const AppLayout = () => {
  return (
    <div
      id="layout"
      className="lg:w-3/5 mx-auto bg-app select-none padding-safe-area-top text-color-primary"
    >
      <ScrollRestoration
        getKey={(location, matches) => {
          // return location.pathname each time if you want scroll restored to
          // top of page for every single route navigation.
          // If you don't want to restore scroll for some routes then return
          // their pathname.
          // For example, here I am not restoring scroll when the user navigates
          // to the dashboard. If I don't want to restore scroll for
          // /transactions then I would check
          // if location.pathname === "/transactions" return location.pathname

          // If this is the ledger transaction page then restore scroll.
          // ledger/:ledgerId/transactions
          const isLedger =
            location.pathname.split("/")[1] === "ledger" &&
            location.pathname.split("/")[3] === "transactions";

          if (location.pathname === "/") {
            return location.pathname;
          } else {
            return location.key;
          }
        }}
      />
      <Outlet />
      <FooterNav />
    </div>
  );
};
