import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState, createContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

// Components
import { AppLayout } from "./AppLayout";
import { FooterNav } from "../components/FooterNav";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";

// Context
export const RootContext = createContext(null);

import { squircle } from "ldrs";

// This is the container that wraps my entire application. It is responsible for
// subscribing to all of the Meteor subscriptions used throughout the app.
// I want absolutely zero loading screens when users navigate throughout the app
// therefore all subscriptions are initiated before the app loads. This way
// components can trust that data they need is already loaded into mini-mongo.
// This app is also simple enough to easily allow me to implement this type of
// architecture.
export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState(undefined);
  const [date, setDate] = useState(getDateFromLocalStorage());

  // Fetch the budget
  const isLoadingAllBudgets = useTracker(() => {
    const budgetHandle = Meteor.subscribe("allBudgets");
    return !budgetHandle.ready();
  }, []);

  // Fetch the collections for this budget.
  const isLoadingAllCollections = useTracker(() => {
    if (isLoadingAllBudgets) return true;
    const envelopeHandler = Meteor.subscribe("envelopes", budget._id);
    const ledgerHandler = Meteor.subscribe("ledgers", budget._id);
    const transactionHandler = Meteor.subscribe("transactions", budget._id);
    const userDataHandler = Meteor.subscribe("userData", budget._id);
    const tagHandler = Meteor.subscribe("tags");
    const allUsers = Meteor.subscribe("allUsers");
    return !(
      envelopeHandler.ready() &&
      ledgerHandler.ready() &&
      transactionHandler.ready() &&
      userDataHandler.ready() &&
      tagHandler.ready() &&
      allUsers.ready()
    );
  }, [budget]);

  useEffect(() => {
    if (isLoadingAllBudgets) return;
    const budget = BudgetCollection.findOne({
      createdAt: {
        $gte: date,
        $lte: new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate() - 1
        ),
      },
    });
    setBudget(budget);
  }, [date, isLoadingAllBudgets]);

  useEffect(() => {
    if (isLoadingAllBudgets || isLoadingAllCollections) return;
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  }, [isLoadingAllBudgets, isLoadingAllCollections]);

  return (
    <RootContext.Provider
      value={{
        goToBudget: ({ date }) => {
          window.localStorage.setItem("currentBudgetDate", date);
          setIsLoading(true);
          // Allow the <App/> to complete it's unmount animation before changing the date.
          setTimeout(() => {
            setDate(date);
          }, 900);
        },
        currentBudgetId: budget?._id,
      }}
    >
      <AnimatePresence>
        {isLoading ? <Loading key={0} /> : <Content key={1} />}
      </AnimatePresence>
    </RootContext.Provider>
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

function Content() {
  return (
    <motion.div
      key={2}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="lg:w-3/5 mx-auto bg-app select-none padding-safe-area-top text-color-primary">
        <Outlet />
        <FooterNav />
      </div>
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
