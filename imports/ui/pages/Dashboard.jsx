import React, { createContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopCollection";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";
import { Modal } from "../components/Modal";
import { TransactionForm } from "../components/TransactionForm";
import { BsFillPlusCircleFill } from "react-icons/bs";

export const DashboardContext = createContext(null);
export const Dashboard = () => {
  const {
    loading,
    data: { budget, envelopes },
  } = useTracker(() => {
    const budgetHandler = Meteor.subscribe("budgets");
    const envelopeHandler = Meteor.subscribe("envelopes");
    const ledgerHandler = Meteor.subscribe("ledgers");
    const transactionHandler = Meteor.subscribe("transactions");
    if (
      budgetHandler.ready() &&
      envelopeHandler.ready() &&
      ledgerHandler.ready() &&
      transactionHandler.ready()
    ) {
      // BudgetCollection contains only the budget for this month. It does NOT
      // contain multiple documents. The publisher (on the server) returns only
      // the budget for this month.
      const budget = BudgetCollection.findOne();
      // Get the envelopes for this budget.
      const envelopes = EnvelopeCollection.find({
        _id: { $in: budget.envelopes },
      }).fetch();

      return {
        loading: false,
        data: {
          budget,
          envelopes,
        },
      };
    } else {
      return { loading: true, data: { budget: {}, envelopes: {} } };
    }
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
        {envelopes.map((category, i) => {
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
        className="fixed bottom-5 right-7 w-14 h-14 bg-white rounded-full flex flex-row justify-center items-center"
        onClick={() => setModalOpen((prev) => !prev)}
      >
        <BsFillPlusCircleFill className="text-sky-700 w-full h-full" />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen((prev) => !prev)}>
        <DashboardContext.Provider
          value={{ toggleModal: () => setModalOpen((prev) => !prev) }}
        >
          <TransactionForm />
        </DashboardContext.Provider>
      </Modal>
    </div>
  );
};
