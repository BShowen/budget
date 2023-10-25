import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { BudgetCollection } from "../../api/Budgets/Budget";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";
import { Modal } from "../components/Modal";

export const Dashboard = () => {
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
  const [isModalOpen, setModalOpen] = useState(false);

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
          return (
            <Envelope
              key={i}
              {...category}
              activeTab={activeTab}
              addItemHandler={() => setModalOpen(!isModalOpen)}
            />
          );
        })}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen((prev) => !prev)}>
        <div className="flex flex-row justify-center w-full h-2/4 items-center border-2 border-slate-200">
          Child Component
        </div>
      </Modal>
    </div>
  );
};
