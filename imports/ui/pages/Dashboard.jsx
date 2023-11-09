import React, { createContext, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";
import { IncomeEnvelope } from "../components/IncomeEnvelope";
import { TransactionForm } from "../components/TransactionForm";
import { LedgerTransactions } from "../components/LedgerTransactions";
import { AddEnvelopeButton } from "../components/AddEnvelopeButton";

export const DashboardContext = createContext(null);
export const Dashboard = () => {
  const { budget } = useTracker(() => {
    // BudgetCollection will never contain more than one document.
    // This is on purpose because the budget publication returns one document.
    const budget = BudgetCollection.findOne();
    return {
      budget,
    };
  });

  const { envelopes, incomeEnvelopes } = useTracker(() => {
    if (!budget) {
      return { envelopes: {} };
    }
    // Get the envelopes for this budget.
    const allEnvelopes = EnvelopeCollection.find({
      budgetId: budget._id,
    }).fetch();

    const { envelopes, incomeEnvelopes } = allEnvelopes.reduce(
      (acc, curr) => {
        if (curr.isIncomeEnvelope) {
          return { ...acc, incomeEnvelopes: [...acc.incomeEnvelopes, curr] };
        } else {
          return { ...acc, envelopes: [...acc.envelopes, curr] };
        }
      },
      { envelopes: [], incomeEnvelopes: [] }
    );
    return {
      envelopes,
      incomeEnvelopes,
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
    budgetId: budget._id,
  };

  return (
    <div className="w-full pb-12 relative z-0 border-2">
      <div className="fixed top-0 left-0 right-0 z-20 w-full lg:w-3/5 mx-auto">
        <DashboardHeader
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          date={budget.createdAt}
        />
      </div>

      <div className="pt-32 pb-8 px-2 flex flex-col items-stretch gap-5 z-10">
        {/* Categories container */}
        <DashboardContext.Provider value={dashboardContext}>
          {incomeEnvelopes.map((envelope) => (
            <IncomeEnvelope
              key={envelope._id}
              {...envelope}
              activeTab={activeTab}
            />
          ))}
          {envelopes.map((envelope) => (
            <Envelope key={envelope._id} {...envelope} activeTab={activeTab} />
          ))}
          <AddEnvelopeButton />
        </DashboardContext.Provider>
      </div>

      <DashboardContext.Provider value={dashboardContext}>
        <div className="relative z-40">
          {formState.isOpen && (
            <TransactionForm
              isOpen={formState.isOpen}
              onClose={dashboardContext.toggleForm}
              defaultLedgerSelection={formState.ledgerId}
            />
          )}
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
