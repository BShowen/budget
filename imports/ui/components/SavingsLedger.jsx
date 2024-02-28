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

export const SavingsLedger = ({ ledger, activeTab }) => {
  const [isFormActive, setFormActive] = useState(false);
  const { expense, income: savedThisMonth } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
    // Calculate this ledgers expense and income from it's transactions
    return reduceTransactions({ transactions });
  });

  const remainingToReceive =
    Math.round((ledger.allocatedAmount - savedThisMonth) * 100) / 100 < 0
      ? 0
      : Math.round((ledger.allocatedAmount - savedThisMonth) * 100) / 100;

  const calculateDisplayBalance = () => {
    switch (activeTab) {
      case "planned":
        return Math.round(ledger.allocatedAmount * 100) / 100;
      case "spent":
        return expense;
      case "remaining":
        return remainingToReceive;
    }
  };

  const calculateProgress = () => {
    let progress = undefined;
    if (activeTab === "planned") {
      progress = 0;
    } else if (activeTab === "spent") {
      progress = ((expense / ledger.allocatedAmount) * 100).toFixed(2);
    } else if (activeTab === "remaining") {
      progress = remainingToReceive
        ? ((remainingToReceive / ledger.allocatedAmount) * 100).toFixed(2)
        : 0;
    }
    return progress;
  };

  const activateForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormActive(true);
  };

  const displayBalance = calculateDisplayBalance();
  return (
    <div className="w-full h-8 relative z-0 px-2 py-1 bg-slate-100 rounded-md lg:hover:cursor-pointer flex flex-row justify-between items-center">
      {isFormActive ? (
        <>
          <UpdateLedgerForm
            toggleForm={() => setFormActive(false)}
            ledger={ledger}
          />
          <Progress percent={calculateProgress()} />
        </>
      ) : (
        <Link
          to={`/ledger/${ledger._id}/transactions`}
          className="w-full h-full p-0 m-0 flex flex-row justify-between items-center"
        >
          <h2 className="font-semibold z-20">{cap(ledger.name)}</h2>
          <h2
            onClick={activateForm}
            className={`font-bold z-20 ${
              displayBalance < 0 ? "text-rose-500" : ""
            }`}
          >
            {toDollars(displayBalance)}
          </h2>
          <Progress percent={calculateProgress()} />
        </Link>
      )}
    </div>
  );
};
