import React, { useState } from "react";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";

// Components
import { SavingsLedger } from "../ledgers/SavingsLedger";
import { NewLedgerForm } from "../forms/LedgerFormCreate";

// Icons
import { LuPlusCircle } from "react-icons/lu";

// Hooks
import { useSavingsCategory } from "../../hooks/useSavingsCategory";
export const SavingsCategory = ({ _id, name, activeTab }) => {
  const { ledgerList, displayBalance } = useSavingsCategory({
    envelopeId: _id,
    activeTab,
  });

  return (
    // Envelope container
    <div className="envelope">
      <EnvelopeHeader
        name={name}
        activeTab={activeTab}
        displayBalance={displayBalance}
      />
      <EnvelopeBody ledgers={ledgerList} activeTab={activeTab} />
      <EnvelopeFooter envelopeId={_id} />
    </div>
  );
};

function EnvelopeHeader({ name, activeTab, displayBalance }) {
  let categoryName = "";
  switch (activeTab) {
    case "planned":
      categoryName = "planned to save";
      break;
    case "spent":
      categoryName = "saved so far";
      break;
    case "remaining":
      categoryName = "left to save";
      break;
  }
  return (
    <div className="envelope-header">
      <h1 className="relative z-50">{cap(name)}</h1>
      <div className="flex flex-row justify-center items-center gap-1">
        <h2 className="font-semibold text-sm relative z-50 text-color-dark-blue">
          {cap(categoryName)}
        </h2>
        <h2 className="text-sm font-semibold">{toDollars(displayBalance)}</h2>
      </div>
    </div>
  );
}

function EnvelopeBody({ ledgers, activeTab }) {
  return (
    <div className="envelope-body">
      {ledgers.map((ledger) => (
        <SavingsLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
    </div>
  );
}

function EnvelopeFooter({ envelopeId }) {
  const [isFormActive, setFormActive] = useState(false);
  const toggleForm = () => {
    setFormActive((prev) => !prev);
  };

  return (
    <div className="envelope-footer">
      <NewLedgerForm
        toggleForm={toggleForm}
        envelopeId={envelopeId}
        placeholderText={"Savings name"}
      >
        {!isFormActive && (
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-full flex flex-row justify-between items-center gap-3">
              <div className="flex flex-row justify-start items-center gap-1">
                <LuPlusCircle className="text-lg" />
                <p
                  onClick={() => {
                    if (!isFormActive) {
                      toggleForm();
                    }
                  }}
                  className="font-semibold text-sm lg:hover:cursor-pointer"
                >
                  Create savings
                </p>
              </div>
            </div>
          </div>
        )}
      </NewLedgerForm>
    </div>
  );
}
