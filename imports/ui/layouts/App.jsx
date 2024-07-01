import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Hooks
import { useAppData } from "../hooks/useAppData";

// Components
import { AppContent } from "./AppContent";
import { Loader } from "../components/Loader";

// This is the container that wraps my entire application. It is responsible for
// subscribing to all of the Meteor subscriptions used throughout the app.
// I want absolutely zero loading screens when users navigate throughout the app
// therefore all subscriptions are initiated before the app loads. This way
// components can trust that data they need is already loaded into mini-mongo.
// This app is also simple enough to easily allow me to implement this type of
// architecture.
export const App = () => {
  const [timestamp, setTimestamp] = useState(getTimestampFromLocalStorage());
  console.log({ timestamp, date: new Date(timestamp) });
  const { isLoading: isLoadingAppData, currentBudget } = useAppData({
    timestamp,
  });
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
  function handleTimestampChange(newTimestamp) {
    if (newTimestamp == timestamp) return;
    window.localStorage.setItem("currentBudgetTimestamp", newTimestamp);
    setIsLoading(true);
    setTimeout(() => setTimestamp(newTimestamp), 900);
  }

  return (
    <AnimatePresence>
      {isLoading ? (
        <Loader key={0} />
      ) : (
        <AppContent
          key={1}
          setTimestamp={handleTimestampChange}
          currentBudget={currentBudget}
        />
      )}
    </AnimatePresence>
  );
};

function getTimestampFromLocalStorage() {
  let timestamp = window.localStorage.getItem("currentBudgetTimestamp") || "";
  if (new Date(Number.parseInt(timestamp)) == "Invalid Date") {
    timestamp = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime();
    window.localStorage.setItem("currentBudgetTimestamp", timestamp);
  }
  return Number.parseInt(timestamp);
}
