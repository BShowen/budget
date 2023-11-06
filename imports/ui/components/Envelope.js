import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { Ledger } from "./Ledger";
import { NewLedgerForm } from "./NewLedgerForm";

export const Envelope = ({ _id, name, activeTab }) => {
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
    return total + ledger.startingBalance;
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

  const progress =
    activeTab === "spent"
      ? (spent / calculatedEnvelopeBalance) * 100
      : activeTab === "remaining"
      ? (remaining / calculatedEnvelopeBalance) * 100
      : 0;

  return (
    // Envelope container
    <div className="bg-white rounded-lg shadow-md flex flex-col items-stretch px-2 pt-1 pb-2 gap-2 relative z-0">
      <EnvelopeHeader name={name} activeTab={activeTab} progress={progress} />
      <EnvelopeBody ledgers={ledgers} activeTab={activeTab} />
      <EnvelopeFooter displayBalance={displayBalance} envelopeId={_id} />
    </div>
  );
};

function EnvelopeHeader({ name, activeTab }) {
  return (
    <div className="flex flex-row justify-between p-1 px-2 h-8 rounded-md overflow-hidden items-center relative z-0 w-full">
      <h1 className="font-bold relative z-50">{cap(name)}</h1>
      <h2 className="font-semibold relative z-50">{cap(activeTab)}</h2>
    </div>
  );
}

function EnvelopeBody({ ledgers, activeTab }) {
  return (
    <div className="flex flex-col gap-2 z-20">
      {ledgers.map((ledger) => (
        <Ledger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
    </div>
  );
}

function EnvelopeFooter({ displayBalance, envelopeId }) {
  const [isFormActive, setFormActive] = useState(false);
  const toggleForm = () => {
    setFormActive((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-row items-center px-2 h-8 rounded-md ${
        isFormActive ? "bg-slate-100" : ""
      }`}
    >
      <NewLedgerForm toggleForm={toggleForm} envelopeId={envelopeId}>
        {!isFormActive && (
          <div className="w-full flex flex-row justify-between items-center">
            <p
              onClick={() => {
                if (!isFormActive) {
                  toggleForm();
                }
              }}
              className="font-normal lg:hover:cursor-pointer"
            >
              Add item
            </p>
            <h2 className="font-medium">{toDollars(displayBalance)}</h2>
          </div>
        )}
      </NewLedgerForm>
    </div>
  );
}

// function divideAndRoundToNearestTens(balance, n) {
//   const baseProduct = (balance / n).toFixed(2);
//   const balances = [];
//   if ((baseProduct * n).toFixed(2) == balance) {
//     for (let i = 0; i < n; i++) {
//       balances.push(baseProduct);
//     }
//     return balances;
//   } else {
//     for (let i = 0; i < n; i++) {
//       if (i === 0) {
//         const product = ((baseProduct * 100 + 1) / 100).toFixed(2);
//         balances.push(product);
//       } else {
//         balances.push(baseProduct);
//       }
//     }
//     return balances;
//   }
// }
