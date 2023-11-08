// Render and return the splash image regardless of loading state.
// Check for a logged in user.
// If the user is logged in then return a router outlet for child components to render.
// If the user is not logged in then render the login form.

// By doing this I no longer have to use react router because this component
// will initially get loaded and render the app or login screen.
// Because I longer use react router, any pages that need to be rendered will be
// logically rendered starting from this component. The only time this component
// will get re - rendered is if the user refreshes the page. This will make the
// application feel more like a native app when used on mobile devices, which is
// my target audience.

import React, { createContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Components
import { Dashboard } from "./Dashboard";
import { LoginForm } from "../components/LoginForm";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";

export const RootContext = createContext(null);
export const Splash = () => {
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

  const { loading } = useTracker(() => {
    const envelopeHandler = Meteor.subscribe("envelopes", budget?._id);
    const ledgerHandler = Meteor.subscribe("ledgers", budget?._id);
    const transactionHandler = Meteor.subscribe("transactions", budget?._id);
    const userDataHandler = Meteor.subscribe("userData", budget?._id);
    const tagHandler = Meteor.subscribe("tags");
    if (
      Meteor.userId() &&
      envelopeHandler.ready() &&
      ledgerHandler.ready() &&
      transactionHandler.ready() &&
      userDataHandler.ready() &&
      tagHandler.ready()
    ) {
      return { loading: false };
    } else {
      return { loading: true };
    }
  });

  if (!Meteor.userId()) {
    // User is not logged in. Render login screen.
    return <LoginForm />;
  } else if (loading) {
    return <p>Loading...</p>;
  } else if (!loading && budget) {
    return (
      <RootContext.Provider value={{ setDate }}>
        <Dashboard />
      </RootContext.Provider>
    );
  } else if (!loading && !budget) {
    return <p>No budget</p>;
  } else {
    console.log("Something went wrong...");
    return "";
  }
};
