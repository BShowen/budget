import React, { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { TestCollection } from "../../api/testCollection/testCollection";

export const Dashboard = () => {
  const { isLoading, data } = useTracker(() => {
    const handler = Meteor.subscribe("testCollection");

    if (!handler.ready()) {
      return { isLoading: true, data: [] };
    }
    const budgets = TestCollection.find().fetch();
    return { isLoading: false, data: budgets };
  });
  console.log({ isLoading, data });

  return <h1 className="text-3xl">Dashboard!</h1>;
};
