import React from "react";
import { useTracker } from "meteor/react-meteor-data";

// Utils
import { cap } from "../util/cap";
import { decimal } from "../util/decimal";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { Progress } from "./Progress";

// Collections
import { LedgerCollection } from "/imports/api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

export const Ledger = ({ _id, name, startingBalance, activeTab }) => {
  const { transactions } = useTracker(() => {
    // Get the ledger that contains the transactions for this component.
    const ledger = LedgerCollection.findOne({ _id });
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      _id: { $in: ledger.transactions },
    }).fetch();
    return { transactions };
  });

  const { expense, income } = reduceTransactions({ transactions });
  const spent = expense - income;

  const remaining = startingBalance - spent;
  const displayBalance =
    activeTab === "spent"
      ? spent
      : activeTab === "remaining"
      ? remaining
      : startingBalance;

  const progress = calculateProgress();

  function calculateProgress() {
    // If startingBalance is zero then progress should always be zero.
    if (!startingBalance) return 0;
    const progress =
      activeTab === "spent"
        ? (spent / startingBalance) * 100
        : activeTab === "remaining"
        ? (remaining / startingBalance) * 100
        : 0;
    return Number.parseInt(progress.toFixed(0));
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center px-2 bg-slate-100 rounded-md py-1 lg:hover:cursor-pointer h-8 relative">
        <h2 className="font-semibold">{cap(name)}</h2>
        <h2 className="font-normal">{decimal(displayBalance)}</h2>
        <Progress percent={progress} />
      </div>
    </div>
  );
};
