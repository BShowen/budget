import React, { createContext, useState } from "react";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";
import { TransactionForm } from "../components/TransactionForm";
import { LedgerTransactions } from "../components/LedgerTransactions";

// Icons
import { BsFillPlusCircleFill } from "react-icons/bs";

export const DashboardContext = createContext(null);
export const Dashboard = ({ budget, envelopes }) => {
  const [activeTab, setActiveTab] = useState("planned"); // "planned", "spent", "remaining"
  const [formState, setFormState] = useState(false);
  const [ledgerState, setLedgerState] = useState({
    isOpen: false,
    ledger: {},
  });

  const dashboardContext = {
    toggleForm: () => {
      setFormState((prev) => !prev);
    },
    toggleLedger: ({ ledger }) => {
      setLedgerState((prev) => {
        return {
          ...prev,
          isOpen: !prev.isOpen,
          ledger: !prev.isOpen ? ledger : {},
        };
      });
    },
  };

  return (
    <div className="w-full pb-12">
      <DashboardHeader
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        date={budget.createdAt}
      />

      <div className="py-8 px-2 flex flex-col items-stretch gap-5">
        {/* Categories container */}
        <DashboardContext.Provider value={dashboardContext}>
          {envelopes.map((category, i) => {
            return (
              <Envelope
                key={i}
                {...category}
                activeTab={activeTab}
                addItemHandler={() => {
                  alert("Need to implement");
                }}
                toggleLedger={dashboardContext.toggleLedger}
              />
            );
          })}
        </DashboardContext.Provider>
      </div>

      <div
        className="fixed bottom-5 right-7 w-14 h-14 bg-white rounded-full flex flex-row justify-center items-center"
        onClick={() => setFormState((prev) => !prev)}
      >
        <BsFillPlusCircleFill className="text-sky-700 w-full h-full" />
      </div>

      <DashboardContext.Provider value={dashboardContext}>
        <TransactionForm
          isOpen={formState}
          onClose={dashboardContext.toggleForm}
        />
        {ledgerState.isOpen && (
          <LedgerTransactions
            isOpen={ledgerState.isOpen}
            onClose={dashboardContext.toggleLedger}
            ledger={ledgerState.ledger}
          />
        )}
      </DashboardContext.Provider>
    </div>
  );
};
