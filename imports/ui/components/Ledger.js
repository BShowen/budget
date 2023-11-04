import React, { useContext, useState, useSyncExternalStore } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";
import { formatDollarAmount } from "../util/formatDollarAmount";

// Components
import { Progress } from "./Progress";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Context
import { DashboardContext } from "../pages/Dashboard";
import { UpdateLedgerForm } from "./UpdateLedgerForm";

// YOU ARE HERE
// you want to make this component use useTracker to keep track of the ledger.
// this way the logic for rendering form vs ledger are a lot simpler.

// Ill be able to remove name, and starting balance from props.
// useTracker to keep track of ledger updates.
// UpdateForm can be passed the entire ledger object.
// updates will be optimistic and ui will change immediately. No more need for "formState"
// I think UpdateLedgerForm needs to be conditionally rendered because the form
// needs to be controlled in order to format inputs.This means that any changes
// to ledger wont be reflected unless I use useEffect to watch props.

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
  const [formState, setFormState] = useState({
    name: name,
    startingBalance: startingBalance,
  });
  const updateFormState = (e) => {
    const name = e.target.name;
    const value =
      name === "startingBalance"
        ? formatDollarAmount(e.target.value)
        : e.target.value;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const { expense, income } = reduceTransactions({ transactions });
  const spent = expense - income;

  const remaining = startingBalance - spent;

  const displayBalance = calculateDisplayBalance();
  function calculateDisplayBalance() {
    switch (activeTab) {
      case "planned":
        return parseFloat(formState.startingBalance || 0).toFixed(2);
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
      <UpdateLedgerForm
        toggleForm={() => setFormActive(false)}
        envelopeId={envelopeId}
        name={formState.name}
        startingBalance={formState.startingBalance}
        ledgerId={_id}
        updateForm={updateFormState}
      >
        {!isFormActive && (
          <>
            <h2 className="font-semibold z-50">{cap(formState.name)}</h2>
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
      </UpdateLedgerForm>
    </div>
  );
};
