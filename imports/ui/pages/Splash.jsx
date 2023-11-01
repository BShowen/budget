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

import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Components
import { Dashboard } from "./Dashboard";
import { LoginForm } from "../components/LoginForm";

export const Splash = () => {
  const { loading } = useTracker(() => {
    const budgetHandler = Meteor.subscribe("budgets");
    const envelopeHandler = Meteor.subscribe("envelopes");
    const ledgerHandler = Meteor.subscribe("ledgers");
    const transactionHandler = Meteor.subscribe("transactions");
    const paycheckHandler = Meteor.subscribe("paychecks");
    const userDataHandler = Meteor.subscribe("userData");
    if (
      Meteor.userId() &&
      userDataHandler.ready() &&
      budgetHandler.ready() &&
      envelopeHandler.ready() &&
      ledgerHandler.ready() &&
      transactionHandler.ready() &&
      paycheckHandler.ready()
    ) {
      return { loading: false };
    } else {
      return { loading: true };
    }
  });

  if (!Meteor.userId()) {
    // User is not logged in. Render login screen.
    return <LoginForm />;
  } else if (Meteor.userId() && loading) {
    return <p>Loading...</p>;
  } else if (Meteor.userId() && !loading) {
    return <Dashboard />;
  } else {
    console.log("Something went wrong....");
    return "";
  }
};
