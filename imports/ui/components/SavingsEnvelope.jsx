import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { SavingsLedger } from "./SavingsLedger";
import { NewLedgerForm } from "./NewLedgerForm";

// Icons
import { LuPlusCircle } from "react-icons/lu";

export const SavingsEnvelope = ({ _id, name, activeTab }) => {
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
  const plannedToSave = ledgers.reduce((total, ledger) => {
    return total + ledger.allocatedAmount;
  }, 0);

  const { expense, income: savedThisMonth } = reduceTransactions({
    transactions,
  });

  const leftToReceive = plannedToSave - savedThisMonth;
  const displayBalance =
    activeTab === "spent"
      ? savedThisMonth
      : activeTab === "remaining"
      ? leftToReceive
      : plannedToSave;

  return (
    // Envelope container
    <div className="envelope">
      <EnvelopeHeader
        name={name}
        activeTab={activeTab}
        displayBalance={displayBalance}
      />
      <EnvelopeBody ledgers={ledgers} activeTab={activeTab} />
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
  const navigate = useNavigate();
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
              <div className="flex flex-row justify-start items-center gap-1">
                <LuPlusCircle className="text-lg" />
                <p
                  onClick={() => {
                    navigate("/new-allocation");
                  }}
                  className="font-semibold text-sm lg:hover:cursor-pointer"
                >
                  Create allocation
                </p>
              </div>
            </div>
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
