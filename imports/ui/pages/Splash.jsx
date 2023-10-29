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

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopCollection";

// Components
import { Dashboard } from "./Dashboard";
import { LoginForm } from "../components/LoginForm";

export const Splash = () => {
  const { loading, data } = useTracker(() => {
    const budgetHandler = Meteor.subscribe("budgets");
    const envelopeHandler = Meteor.subscribe("envelopes");
    const ledgerHandler = Meteor.subscribe("ledgers");
    const transactionHandler = Meteor.subscribe("transactions");
    const paycheckHandler = Meteor.subscribe("paychecks");
    if (
      Meteor.userId() &&
      budgetHandler.ready() &&
      envelopeHandler.ready() &&
      ledgerHandler.ready() &&
      transactionHandler.ready() &&
      paycheckHandler.ready()
    ) {
      // BudgetCollection contains only the budget for this month. It does NOT
      // contain multiple documents. The publisher (on the server) returns only
      // the budget for this month.
      const budget = BudgetCollection.findOne();
      // Get the envelopes for this budget.
      const envelopes = EnvelopeCollection.find({
        budgetId: budget._id,
      }).fetch();

      return {
        loading: false,
        data: {
          budget,
          envelopes,
        },
      };
    } else {
      return { loading: true, data: undefined };
    }
  });

  if (!Meteor.userId()) {
    // User is not logged in. Render login screen.
    return <LoginForm />;
  } else if (Meteor.userId() && loading) {
    return <p>Loading...</p>;
  } else if (Meteor.userId() && !loading && data) {
    return <Dashboard {...data} />;
  } else {
    console.log("Something went wrong....");
    return "";
  }
};
