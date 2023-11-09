import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { Progress } from "./Progress";
import { UpdateLedgerForm } from "./UpdateLedgerForm";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

export const IncomeLedger = ({ ledger, activeTab }) => {
  const [isFormActive, setFormActive] = useState(false);
  const { expense, income } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
    // Calculate this ledgers expense and income from it's transactions
    const { expense, income } = reduceTransactions({ transactions });
    return { expense, income };
  });

  const remaining = ledger.startingBalance - income + expense;

  const calculateDisplayBalance = () => {
    switch (activeTab) {
      case "planned":
        return parseFloat(ledger.startingBalance).toFixed(2);
      case "spent":
        return expense;
      case "remaining":
        return remaining;
    }
  };

  const calculateProgress = () => {
    let progress = undefined;
    if (activeTab === "planned") {
      progress = 0;
    } else if (activeTab === "spent") {
      progress = (expense / ledger.startingBalance) * 100;
    } else if (activeTab === "remaining") {
      progress = remaining ? (remaining / ledger.startingBalance) * 100 : 0;
    }
    return Number.parseInt(progress.toFixed(0));
  };

  const activateForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormActive(true);
  };

  const displayBalance = calculateDisplayBalance();
  return (
    <div className="w-full h-8 px-2 py-1  relative z-0 flex flex-row items-center bg-slate-100 rounded-md lg:hover:cursor-pointer">
      <Link
        to={`/ledger/${ledger._id}/transactions`}
        className="w-full h-full flex flex-row justify-between items-center"
      >
        {isFormActive ? (
          <UpdateLedgerForm
            toggleForm={() => setFormActive(false)}
            ledger={ledger}
          />
        ) : (
          <>
            <h2 className="font-semibold z-20">{cap(ledger.name)}</h2>
            <h2
              onClick={activateForm}
              className={`font-normal z-20 ${
                displayBalance < 0 ? "text-rose-500" : ""
              }`}
            >
              {toDollars(displayBalance)}
            </h2>
          </>
        )}
        <Progress percent={calculateProgress()} />
      </Link>
    </div>
  );
};