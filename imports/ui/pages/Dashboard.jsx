import React, { createContext, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";
import { TransactionForm } from "../components/TransactionForm";
import { LedgerTransactions } from "../components/LedgerTransactions";

// Icons
import { BsFillPlusCircleFill } from "react-icons/bs";

export const DashboardContext = createContext(null);
export const Dashboard = () => {
  const { budget } = useTracker(() => {
    // BudgetCollection will never container more than one document.
    // This is on purpose because the budget publication returns one document.
    const budget = BudgetCollection.findOne();
    return {
      budget,
    };
  });

  const { envelopes } = useTracker(() => {
    if (!budget) {
      return { envelopes: {} };
    }
    // Get the envelopes for this budget.
    const envelopes = EnvelopeCollection.find({
      budgetId: budget._id,
    }).fetch();

    return {
      envelopes,
    };
  });
  const [activeTab, setActiveTab] = useState("planned"); // "planned", "spent", "remaining"
  const [formState, setFormState] = useState({
    isOpen: false,
    ledgerId: undefined,
  });
  const [ledgerState, setLedgerState] = useState({
    isOpen: false,
    ledgerId: undefined,
  });

  const dashboardContext = {
    toggleForm: (options = {}) => {
      const { ledgerId } = options;
      if (ledgerId) {
        setFormState((prev) => ({
          ...prev,
          isOpen: !prev.isOpen,
          ledgerId: !prev.isOpen ? ledgerId : undefined,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          isOpen: !prev.isOpen,
          ledgerId: undefined,
        }));
      }
    },
    toggleLedger: ({ ledgerId }) => {
      setLedgerState((prev) => ({
        ...prev,
        isOpen: !prev.isOpen,
        ledgerId: !prev.isOpen ? ledgerId : undefined,
      }));
    },
  };

  return (
    <div className="w-full pb-12 relative z-0">
      <div className="sticky top-0 z-20">
        <DashboardHeader
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          date={budget.createdAt}
        />
      </div>

      <div className="py-8 px-2 flex flex-col items-stretch gap-5 z-10">
        {/* Categories container */}
        <DashboardContext.Provider value={dashboardContext}>
          {envelopes.map((category, i) => {
            return <Envelope key={i} {...category} activeTab={activeTab} />;
          })}
        </DashboardContext.Provider>
      </div>

      <div
        className="fixed bottom-5 right-7 w-14 h-14 bg-white rounded-full flex flex-row justify-center items-center z-20"
        onClick={() => dashboardContext.toggleForm()}
      >
        <BsFillPlusCircleFill className="text-sky-700 w-full h-full" />
      </div>

      <DashboardContext.Provider value={dashboardContext}>
        <div className="relative z-40">
          <TransactionForm
            isOpen={formState.isOpen}
            onClose={dashboardContext.toggleForm}
            defaultLedgerSelection={formState.ledgerId}
          />
        </div>
        <div className="relative z-30">
          {ledgerState.isOpen && (
            <LedgerTransactions
              isOpen={ledgerState.isOpen}
              onClose={dashboardContext.toggleLedger}
              ledgerId={ledgerState.ledgerId}
            />
          )}
        </div>
      </DashboardContext.Provider>
    </div>
  );
};
