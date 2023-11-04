import React, { useContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { Progress } from "./Progress";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Context
import { DashboardContext } from "../pages/Dashboard";
import { NewLedgerForm } from "./NewLedgerForm";

export const Ledger = ({
  _id,
  name,
  startingBalance,
  activeTab,
  envelopeId,
}) => {
  const { transactions } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      ledgerId: _id,
    }).fetch();
    return { transactions };
  });
  const { toggleLedger } = useContext(DashboardContext);
  const [isFormActive, setFormActive] = useState(false);

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
      onClick={() => (isFormActive ? null : toggleLedger({ ledgerId: _id }))}
      className="flex flex-row justify-between items-center px-2 bg-slate-100 rounded-md py-1 lg:hover:cursor-pointer h-8 relative z-0"
    >
      <NewLedgerForm
        toggleForm={() => setFormActive(false)}
        envelopeId={envelopeId}
        options={{ isUpdate: true }}
        defaultValues={{
          name: cap(name),
          startingBalance: startingBalance,
          ledgerId: _id,
        }}
      >
        {!isFormActive && (
          <>
            <h2 className="font-semibold z-50">{cap(name)}</h2>
            <h2
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFormActive(true);
              }}
              className={`font-normal z-50 ${
                displayBalance < 0 ? "text-rose-500" : ""
              }`}
            >
              {toDollars(displayBalance)}
            </h2>
            <Progress percent={progress} />
          </>
        )}
      </NewLedgerForm>
    </div>
  );
};
