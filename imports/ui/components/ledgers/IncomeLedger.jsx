import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";
import { reduceTransactions } from "../../util/reduceTransactions";

// Components
import { LedgerProgress } from "./ledgerComponents/LedgerProgress";
import { UpdateLedgerForm } from "../forms/LedgerFormUpdate";

// Collections
import { TransactionCollection } from "../../../api/Transaction/TransactionCollection";

export const IncomeLedger = ({ ledger, activeTab }) => {
  const [isFormActive, setFormActive] = useState(false);
  const incomeReceived = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
    // Calculate this ledgers expense and income from it's transactions
    const { income: incomeReceived } = reduceTransactions({ transactions });
    return incomeReceived;
  });

  const remainingToReceive =
    Math.round((ledger.allocatedAmount - incomeReceived) * 100) / 100;

  const calculateDisplayBalance = () => {
    switch (activeTab) {
      case "planned":
        return Math.round(ledger.allocatedAmount * 100) / 100;
      case "spent":
        return incomeReceived;
      case "remaining":
        return ledger.allocatedAmount > 0 ? remainingToReceive : 0;
    }
  };

  const calculateProgress = () => {
    if (activeTab === "planned") {
      return 0;
    } else if (activeTab === "spent") {
      return ledger.allocatedAmount
        ? Math.round((incomeReceived / ledger.allocatedAmount) * 100)
        : 0;
    } else if (activeTab === "remaining") {
      return ledger.allocatedAmount
        ? Math.round((remainingToReceive / ledger.allocatedAmount) * 100)
        : 0;
    }
  };

  const activateForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormActive(true);
  };

  const displayBalance = calculateDisplayBalance();
  return (
    <div className="w-full h-8 relative z-0 px-2 py-1 bg-slate-100 rounded-lg lg:hover:cursor-pointer flex flex-row justify-between items-center">
      {isFormActive ? (
        <>
          <UpdateLedgerForm
            toggleForm={() => setFormActive(false)}
            ledger={ledger}
          />
          <LedgerProgress percent={calculateProgress()} />
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
          <LedgerProgress percent={calculateProgress()} />
        </Link>
      )}
    </div>
  );
};
