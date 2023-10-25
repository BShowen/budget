import React, { createContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { BudgetCollection } from "../../api/Budgets/Budget";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";
import { Modal } from "../components/Modal";
import { TransactionForm } from "../components/TransactionForm";
import { BsFillPlusCircleFill } from "react-icons/bs";

export const DashboardContext = createContext(null);
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
    <div className="w-full pb-12">
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
              addItemHandler={() => {
                alert("Need to implement");
              }}
            />
          );
        })}
      </div>

      <div
        className="fixed bottom-8 right-8 w-10 h-10 bg-white rounded-full flex flex-row justify-center items-center"
        onClick={() => setModalOpen((prev) => !prev)}
      >
        <BsFillPlusCircleFill className="text-sky-700 w-full h-full" />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen((prev) => !prev)}>
        <DashboardContext.Provider
          value={{ toggleModal: () => setModalOpen((prev) => !prev) }}
        >
          <TransactionForm
            ledgers={budget.envelopes.reduce((acc, envelope) => {
              return [...acc, ...envelope.ledgers];
            }, [])}
          />
        </DashboardContext.Provider>
      </Modal>
    </div>
  );
};
