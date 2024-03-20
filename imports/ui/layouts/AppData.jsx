import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState, createContext } from "react";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

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
      return {
        budget: BudgetCollection.findOne({
          createdAt: {
            $gte: date,
            $lte: new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate() - 1
            ),
          },
        }),
      };
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
    const allUsers = Meteor.subscribe("allUsers");
    const allBudgets = Meteor.subscribe("allBudgets");
    return !(
      envelopeHandler.ready() &&
      ledgerHandler.ready() &&
      transactionHandler.ready() &&
      userDataHandler.ready() &&
      tagHandler.ready() &&
      allUsers.ready() &&
      allBudgets.ready()
    );
  });

  const uncategorizedTransactions = useTracker(() => {
    if (loading) return 0;

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

  return loading ? (
    <p>Loading</p>
  ) : (
    <RootContext.Provider
      value={{
        goToBudget: ({ date }) => {
          setDate(date);
        },
        currentBudgetId: budget?._id,
        uncategorizedTransactions,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};
