import React, { useContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { Progress } from "./Progress";
import { UpdateLedgerForm } from "./UpdateLedgerForm";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Context
import { DashboardContext } from "../pages/Dashboard";

export const Ledger = ({ ledger, activeTab }) => {
  const [isFormActive, setFormActive] = useState(false);
  // Open open/close ledger transactions
  const { toggleLedger } = useContext(DashboardContext);
  const spent = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
    // Calculate this ledgers expense and income from it's transactions
    const { expense, income } = reduceTransactions({ transactions });
    // Calculate how much has been spent out of this ledger.
    const spent = expense - income;
    return spent;
  });

  const remaining = ledger.startingBalance - spent;

  const calculateDisplayBalance = () => {
    switch (activeTab) {
      case "planned":
        return parseFloat(ledger.startingBalance).toFixed(2);
      case "spent":
        return spent;
      case "remaining":
        return remaining;
    }
  };

  const calculateProgress = () => {
    let progress = undefined;
    if (activeTab === "planned") {
      progress = 0;
    } else if (activeTab === "spent") {
      progress = (spent / ledger.startingBalance) * 100;
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
    <div
      onClick={() => !isFormActive && toggleLedger({ ledgerId: ledger._id })}
      className="flex flex-row justify-between items-center px-2 bg-slate-100 rounded-md py-1 lg:hover:cursor-pointer h-8 relative z-0"
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
    </div>
  );
};
