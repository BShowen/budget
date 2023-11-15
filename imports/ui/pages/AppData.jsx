import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState, createContext } from "react";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";

export const RootContext = createContext(null);

// This is the container that wraps my entire application. It is responsible for
// subscribing to all of the Meteor subscriptions used throughout the app.
// I want absolutely zero loading screens when users navigate throughout the app
// therefore all subscriptions are initiated before the app loads. This way
// components can trust that data they need is already loaded into mini-mongo.
// This app is also simple enough to easily allow me to implement this type of
// architecture.
export const AppData = ({ children }) => {
  const [date, setDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  // useTracker to get the budget list
  const { budget } = useTracker(() => {
    // get the most recent budget and return it
    const budgetHandler = Meteor.subscribe("budget", date);
    if (Meteor.userId() && budgetHandler.ready()) {
      return { budget: BudgetCollection.findOne() };
    } else {
      return { budget: undefined };
    }
  });

  const loading = useTracker(() => {
    const envelopeHandler = Meteor.subscribe("envelopes", budget?._id);
    const ledgerHandler = Meteor.subscribe("ledgers", budget?._id);
    const transactionHandler = Meteor.subscribe("transactions", budget?._id);
    const userDataHandler = Meteor.subscribe("userData", budget?._id);
    const tagHandler = Meteor.subscribe("tags");

    return !(
      envelopeHandler.ready() &&
      ledgerHandler.ready() &&
      transactionHandler.ready() &&
      userDataHandler.ready() &&
      tagHandler.ready()
    );
  });

  return loading ? (
    <p>Loading</p>
  ) : (
    <RootContext.Provider
      value={{
        goPreviousMonth: () => {
          setDate(
            (prevDate) =>
              new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
          );
        },
        goNextMonth: () => {
          setDate(
            (prevDate) =>
              new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
          );
        },
      }}
    >
      {children}
    </RootContext.Provider>
  );
};
