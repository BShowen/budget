import React, { createContext } from "react";
import { ScrollRestoration } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

// Components
import { FooterNav } from "../components/FooterNav";

// Context
export const RootContext = createContext(null);

// Helpers
import { useTheme } from "../hooks/useTheme";

export function AppContent({ setTimestamp, currentBudget }) {
  const { selectedTheme, setTheme, activeTheme } = useTheme();

  return (
    <motion.div
      key={2}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <RootContext.Provider
        value={{
          goToBudget: ({ timestamp }) => {
            setTimestamp(timestamp);
          },
          currentBudgetId: currentBudget?._id,
          activeTheme, // "light", or "dark"
          selectedTheme, // "light", "dark" or "system"
          setTheme,
        }}
      >
        <div className="select-none padding-safe-area-top">
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
