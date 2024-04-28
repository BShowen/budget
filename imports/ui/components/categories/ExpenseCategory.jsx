import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../../api/Transaction/TransactionCollection";
import { EditEnvelopeForm } from "../forms/EnvelopeFormUpdate";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";
import { reduceTransactions } from "../../util/reduceTransactions";

// Components
import { ExpenseLedger } from "../ledgers/ExpenseLedger";
import { NewLedgerForm } from "../forms/LedgerFormCreate";

// Icons
import { LuPlusCircle } from "react-icons/lu";

export const ExpenseCategory = ({ _id, name, activeTab }) => {
  const { ledgers } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Return the ledgers that belong to this envelope
    const ledgers = LedgerCollection.find({
      envelopeId: _id,
    }).fetch();
    return { ledgers };
  });

  const { transactions } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Return the transactions that are in this envelope
    const transactions = TransactionCollection.find({
      envelopeId: _id,
    }).fetch();
    return { transactions };
  });
  const calculatedEnvelopeBalance = ledgers.reduce((total, ledger) => {
    return total + ledger.allocatedAmount;
  }, 0);

  const { expense, income } = reduceTransactions({ transactions });
  const spent = expense - income;

  const remaining = calculatedEnvelopeBalance - spent;
  const displayBalance =
    activeTab === "spent"
      ? spent
      : activeTab === "remaining"
      ? remaining
      : calculatedEnvelopeBalance;

  return (
    // Envelope container
    <div className="envelope">
      <EnvelopeHeader
        name={name}
        activeTab={activeTab}
        envelopeId={_id}
        displayBalance={displayBalance}
      />
      <EnvelopeBody ledgers={ledgers} activeTab={activeTab} />
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
