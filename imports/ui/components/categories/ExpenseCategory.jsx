import React, { useState } from "react";

// Collections
import { EditEnvelopeForm } from "../forms/EnvelopeFormUpdate";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";

// Components
import { ExpenseLedger } from "../ledgers/ExpenseLedger";
import { NewLedgerForm } from "../forms/LedgerFormCreate";

// Icons
import { LuPlusCircle } from "react-icons/lu";

// Hooks
import { useExpenseCategory } from "../../hooks/useExpenseCategory";

export const ExpenseCategory = ({ _id, name, activeTab }) => {
  const { ledgerList, displayBalance } = useExpenseCategory({
    envelopeId: _id,
    activeTab,
  });

  return (
    // Envelope container
    <div className="envelope">
      <EnvelopeHeader
        name={name}
        activeTab={activeTab}
        envelopeId={_id}
        displayBalance={displayBalance}
      />
      <EnvelopeBody ledgers={ledgerList} activeTab={activeTab} />
      <EnvelopeFooter envelopeId={_id} />
    </div>
  );
};

function EnvelopeHeader({ name, activeTab, envelopeId, displayBalance }) {
  const [isEditing, setEditing] = useState(false);

  const toggleEditing = () => setEditing((prev) => !prev);

  return (
    <div className="envelope-header">
      {isEditing ? (
        <EditEnvelopeForm
          envelopeId={envelopeId}
          envelopeName={name}
          toggleForm={toggleEditing}
        />
      ) : (
        <>
          <h1
            onClick={toggleEditing}
            className="relative z-50 lg:hover:cursor-text"
          >
            {cap(name)}
          </h1>
          <div className="flex flex-row justify-center items-center gap-1">
            <h2 className="font-semibold text-sm relative z-50 text-color-dark-blue">
              {cap(activeTab)}
            </h2>
            <h2 className="text-sm font-semibold">
              {toDollars(displayBalance)}
            </h2>
          </div>
        </>
      )}
    </div>
  );
}

function EnvelopeBody({ ledgers, activeTab }) {
  return (
    <div className="envelope-body">
      {ledgers.map((ledger) => (
        <ExpenseLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
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
      <NewLedgerForm toggleForm={toggleForm} envelopeId={envelopeId}>
        {!isFormActive && (
          <div className="w-full flex flex-row justify-between items-center">
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
                Create ledger
              </p>
            </div>
          </div>
        )}
      </NewLedgerForm>
    </div>
  );
}
