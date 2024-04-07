import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState, createContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

// Components
import { AppLayout } from "../layouts/AppLayout";
import { FooterNav } from "../components/FooterNav";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

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
export const AppData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState(false);
  const [date, setDate] = useState(getDateFromLocalStorage());

  // Fetch the budgets
  const isFetchingBudget = useTracker(() => {
    const allBudgets = Meteor.subscribe("allBudgets");
    return !allBudgets.ready();
  });

  // Fetch the collections for this budget.
  const isFetchingCollections = useTracker(() => {
    // If the budget is fasly then don't attempt to fetch any collections
    if (budget) {
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
    } else {
      return true;
    }
  }, [budget]);

  const uncategorizedTransactions = useTracker(() => {
    if (isFetchingCollections) return 0;

    const transactions = TransactionCollection.find({
      $or: [
        { envelopeId: { $exists: false } },
        { envelopeId: undefined },
        { ledgerId: { $exists: false } },
        { ledgerId: undefined },
      ],
    }).fetch();
    return transactions.length;
  });

  // When the date changes, fetch the new budget for this date.
  useEffect(() => {
    const getCurrentBudget = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            BudgetCollection.findOne({
              createdAt: {
                $gte: date,
                $lte: new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  date.getDate() - 1
                ),
              },
            })
          );
        }, 2000);
      });
    };
    getCurrentBudget().then((result) => {
      setBudget(result);
    });
  }, [date]);

  // Update isLoading when isFetchingBudget or isFetchingCollections is true
  useEffect(() => {
    if (isFetchingBudget || isFetchingCollections) {
      if (isLoading) return;
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isFetchingBudget, isFetchingCollections]);

  return (
    <AppLayout>
      <AnimatePresence>
        {isLoading ? (
          <Loading key={1} />
        ) : (
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
                  setIsLoading(true);
                  setDate(date);
                },
                currentBudgetId: budget?._id,
                uncategorizedTransactions,
              }}
            >
              <Outlet />
              <FooterNav />
            </RootContext.Provider>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
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

function getDateFromLocalStorage() {
  const date = new Date(window.localStorage.getItem("currentBudgetDate") || "");
  return date == "Invalid Date"
    ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    : date;
}
