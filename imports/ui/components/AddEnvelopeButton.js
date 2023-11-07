import React, { useContext } from "react";
import { Meteor } from "meteor/meteor";

// Context
import { DashboardContext } from "../pages/Dashboard";
export const AddEnvelopeButton = () => {
  const { budgetId } = useContext(DashboardContext);
  const handleClick = () => {
    Meteor.call("envelope.createEnvelope", { budgetId });
  };

  return (
    <button>
      <h2
        className="text-xl font-bold text-green-500 lg:hover:cursor-pointer lg:hover:text-green-600 lg:hover:underline transition-text duration-150"
        onClick={handleClick}
      >
        Add envelope
      </h2>
    </button>
  );
};
