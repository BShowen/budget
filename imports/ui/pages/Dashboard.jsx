import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { BudgetCollection } from "../../api/Budgets/Budget";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";

export const Dashboard = () => {
  // const user = useTracker(Meteor.user);
  const { loading, budget } = useTracker(() => {
    const noData = { loading: false, budget: {} };
    const handler = Meteor.subscribe("budgets");
    if (!handler.ready()) {
      return { ...noData, loading: true };
    }

    const data = BudgetCollection.find({}).fetch();
    return {
      loading: false,
      budget: data[0],
    };
  });
  const [activeTab, setActiveTab] = useState("planned"); // "planned", "spent", "remaining"

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="w-full">
      <DashboardHeader
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        date={budget.createdAt}
      />

      <div className="py-8 px-2 flex flex-col items-stretch gap-5">
        {/* Categories container */}
        {budget.envelopes.map((category, i) => {
          return <Envelope key={i} {...category} activeTab={activeTab} />;
        })}
      </div>
    </div>
  );
};
