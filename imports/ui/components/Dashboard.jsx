import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { BudgetCollection } from "../../api/Budgets/Budget";
import { Category } from "./Category";

// Icons
import { IoPersonCircleSharp } from "react-icons/io5";

// Components
import { BudgetDate } from "./BudgetDate";
import { DashboardButtonGroup } from "./DashboardButtonGroup";

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
      <div className="bg-sky-500 pb-3 sticky top-0 shadow-md rounded-b-md">
        <div className="w-full flex flex-row flex-nowrap items-center justify-between py-1">
          <BudgetDate date={budget.createdAt} />
          <IoPersonCircleSharp className="text-5xl me-2 text-sky-700" />
        </div>
        <div className="w-full px-1 py-4">
          <DashboardButtonGroup
            active={activeTab}
            setActiveTab={(activeTab) => setActiveTab(activeTab)}
          />
        </div>
      </div>
      <div className="py-8 px-2 flex flex-col items-stretch gap-5">
        {/* Categories container */}
        {budget.categories.map((category, i) => {
          return <Category key={i} {...category} activeTab={activeTab} />;
        })}
      </div>
    </div>
  );
};
