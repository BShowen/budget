import React, { useState, createContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

// Components
import { FooterNav } from "../components/FooterNav";
import { squircle } from "ldrs";

// hooks
import { useAppData } from "../hooks/useAppData";

// Context
export const RootContext = createContext(null);

// This is the container that wraps my entire application. It is responsible for
// subscribing to all of the Meteor subscriptions used throughout the app.
// I want absolutely zero loading screens when users navigate throughout the app
// therefore all subscriptions are initiated before the app loads. This way
// components can trust that data they need is already loaded into mini-mongo.
// This app is also simple enough to easily allow me to implement this type of
// architecture.
export const App = () => {
  const [date, setDate] = useState(getDateFromLocalStorage());
  const { isLoading: isLoadingAppData, currentBudget } = useAppData({ date });
  const [isLoading, setIsLoading] = useState(true);

  // When isLoadingAppData is false then set isLoading to false.
  useEffect(() => {
    if (isLoadingAppData) return;
    setIsLoading(false);
  }, [isLoadingAppData]);

  // When the user selects a different month, set isLoading to true then wait
  // 900ms before changing the date. This give the app enough time to animate
  // out and also prevents the "currentBudget" from being set to undefined
  // before the app unmounts. If that happens then an error occurs because
  // currentBudget is expected to never be falsy.
  function handleDateChange(newDate) {
    if (newDate.getTime() == date.getTime()) return;
    setIsLoading(true);
    setTimeout(() => setDate(newDate), 900);
  }

  return (
    <AnimatePresence>
      {isLoading ? (
        <Loading key={0} />
      ) : (
        <Content
          key={1}
          setDate={handleDateChange}
          currentBudget={currentBudget}
        />
      )}
    </AnimatePresence>
  );
};

function Loading() {
  squircle.register();

  useEffect(() => {
    document.body.classList.add("prevent-scroll");
    return () => document.body.classList.remove("prevent-scroll");
  }, []);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0 }}
      className="w-full height-full flex flex-col justify-center items-center z-[51] relative gap-1"
    >
      <l-squircle
        size="60"
        speed="1.0"
        color="#0169FE"
        stroke-length="0.20"
        bg-opacity="0.1"
      ></l-squircle>
    </motion.div>
  );
}

function Content({ setDate, currentBudget }) {
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
        </div>
      </RootContext.Provider>
    </motion.div>
  );
}

function getDateFromLocalStorage() {
  const date = new Date(window.localStorage.getItem("currentBudgetDate") || "");
  if (date == "Invalid Date") {
    const newDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    window.localStorage.setItem("currentBudgetDate", newDate);
  } else {
    return date;
  }
}
