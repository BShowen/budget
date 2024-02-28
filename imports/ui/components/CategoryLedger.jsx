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

export const CategoryLedger = ({ ledger, activeTab }) => {
  const [isFormActive, setFormActive] = useState(false);
  const spent = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
    // Calculate this ledgers expense and income from it's transactions
    const { expense, income } = reduceTransactions({ transactions });
    // Calculate how much has been spent out of this ledger.
    const spent = Math.round((expense - income) * 100) / 100;
    return spent;
  });

  const remaining = Math.round((ledger.allocatedAmount - spent) * 100) / 100;

  const calculateDisplayBalance = () => {
    switch (activeTab) {
      case "planned":
        return Math.round(ledger.allocatedAmount * 100) / 100;
      case "spent":
        // If spent is less than 0 then you haven't technically "spent" anything.
        // That is why I am returning 0 when spent is negative.
        // Spent can be negative when carrying over a balance from the previous
        // month or when a ledger receives a refund more than the allocation amount.
        return spent < 0 ? 0 : spent;
      case "remaining":
        return remaining;
    }
  };

  const calculateProgress = () => {
    let progress = 0;
    if (activeTab === "planned") {
      progress = 0;
    } else if (activeTab === "spent") {
      if (ledger.allocatedAmount > 0) {
        progress = Math.floor((spent / ledger.allocatedAmount) * 100);
      }
    } else if (activeTab === "remaining") {
      if (remaining > ledger.allocatedAmount) {
        // If remaining is greater than allocated amount then progress should
        // always be 100. Otherwise progress will be red when it should be
        // green. This can happen when a ledger balance is carried over from
        // a previous month or when a refund is received in a ledger that
        // causes the remaining balance for that ledger to be greater than the
        // allocated amount for that ledger for the month.
        progress = 100;
      } else if (remaining < 0) {
        progress = 101;
      } else if (remaining >= 0) {
        progress = Math.floor(
          (Math.abs(remaining) / ledger.allocatedAmount) * 100
        );
      }
    }
    // Normalize the percentage.Before: 58.333333333 After: 58
    progress = Math.floor(progress > 100 ? 101 : progress);
    return Number.parseInt(progress.toFixed(0));
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
