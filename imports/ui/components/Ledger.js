import React, { useContext } from "react";
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

// Context
import { DashboardContext } from "../pages/Dashboard";

export const Ledger = ({
  _id,
  name,
  startingBalance,
  activeTab,
  envelopeId,
}) => {
  const { transactions, ledger } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Get the ledger that contains the transactions for this component.
    const ledger = LedgerCollection.findOne({ _id });
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      _id: { $in: ledger.transactions },
    }).fetch();
    return { transactions, ledger };
  });
  const { toggleLedger } = useContext(DashboardContext);

  const { expense, income } = reduceTransactions({ transactions });
  const spent = expense - income;

  // If startingBalance is undefined, that means this ledger belongs to
  // an unallocated envelope. In this case the remaining balance should be
  // undefined because we need a starting balance in order to have a remaining
  // balance.
  const remaining = startingBalance ? startingBalance - spent : undefined;

  const displayBalance = calculateDisplayBalance();
  function calculateDisplayBalance() {
    switch (activeTab) {
      case "planned":
        return startingBalance;
      case "spent":
        return spent;
      case "remaining":
        return remaining;
    }
  }

  const progress = calculateProgress();
  function calculateProgress() {
    let progress = undefined;
    if (activeTab === "planned") {
      progress = 0;
    } else if (activeTab === "spent") {
      progress = (spent / startingBalance) * 100;
    } else if (activeTab === "remaining") {
      progress = remaining ? (remaining / startingBalance) * 100 : 0;
    }
    return Number.parseInt(progress.toFixed(0));
  }

  return (
    <div
      onClick={() => toggleLedger({ ledger, envelopeId })}
      className="flex flex-row justify-between items-center px-2 bg-slate-100 rounded-md py-1 lg:hover:cursor-pointer h-8 relative"
    >
      <h2 className="font-semibold">{cap(name)}</h2>
      <h2
        className={`font-normal ${displayBalance < 0 ? "text-rose-500" : ""}`}
      >
        {decimal(displayBalance)}
      </h2>
      <Progress percent={progress} />
    </div>
  );
};
