import React, { createContext } from "react";
import { ScrollRestoration } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

// Components
import { FooterNav } from "../components/FooterNav";

// Context
export const RootContext = createContext(null);

export function AppContent({ setDate, currentBudget }) {
  return (
    <motion.div
      key={2}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <RootContext.Provider
        value={{
          goToBudget: ({ date }) => {
            window.localStorage.setItem("currentBudgetDate", date);
            setDate(date);
          },
          currentBudgetId: currentBudget?._id,
        }}
      >
        <div className="lg:w-3/5 mx-auto bg-app select-none padding-safe-area-top text-color-primary">
          <Outlet />
          <FooterNav />
          <ScrollRestoration
            getKey={(location) => {
              if (location.pathname === "/") {
                return location.pathname;
              } else {
                return location.key;
              }
            }}
          />
        </div>
      </RootContext.Provider>
    </motion.div>
  );
}
