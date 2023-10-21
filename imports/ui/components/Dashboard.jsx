import React, { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { BudgetCollection } from "../../api/Budgets/Budget";

// import { UserCollection } from "../../api/Users/Users";

export const Dashboard = () => {
  const user = useTracker(Meteor.user);
  const { loading, data } = useTracker(() => {
    const noData = { loading: false, data: [] };
    const handler = Meteor.subscribe("budgets");
    if (!handler.ready()) {
      return { ...noData, loading: true };
    }

    return {
      loading: false,
      data: BudgetCollection.find({}).fetch(),
    };
  });

  console.log({ loading, data });
  return (
    <div>
      <h1 className="text-3xl">Welcome {user?.profile?.firstName}</h1>
    </div>
  );
};
