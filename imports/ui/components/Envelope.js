import React from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";
import { Progress } from "./Progress";

// Utils
import { cap } from "../util/cap";
import { decimal } from "../util/decimal";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { Ledger } from "./Ledger";

export const Envelope = ({
  _id,
  name,
  startingBalance,
  activeTab,
  isAllocated,
  addItemHandler,
}) => {
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

  const { expense, income } = reduceTransactions({ transactions });
  const spent = expense - income;

  const remaining = startingBalance - spent;
  const displayBalance =
    activeTab === "spent"
      ? spent
      : activeTab === "remaining"
      ? remaining
      : startingBalance;

  const progress =
    activeTab === "spent"
      ? (spent / startingBalance) * 100
      : activeTab === "remaining"
      ? (remaining / startingBalance) * 100
      : 0;

  return (
    // Envelope container
    <div className="bg-white rounded-lg shadow-md flex flex-col items-stretch px-2 pt-1 gap-2 relative z-0">
      <EnvelopeHeader
        name={name}
        activeTab={activeTab}
        isAllocated={isAllocated}
        progress={progress}
      />
      <EnvelopeBody ledgers={ledgers} activeTab={activeTab} />
      <EnvelopeFooter
        displayBalance={displayBalance}
        addItemHandler={addItemHandler}
      />
    </div>
  );
};

function EnvelopeHeader({ name, activeTab, isAllocated, progress }) {
  return (
    <div className="flex flex-row justify-between p-1 px-2 h-8 rounded-md overflow-hidden items-center relative z-0 w-full">
      <h1 className="font-bold relative z-50">{cap(name)}</h1>
      <h2 className="font-semibold relative z-50">{cap(activeTab)}</h2>
      {!isAllocated && <Progress percent={progress} />}
    </div>
  );
}

function EnvelopeBody({ ledgers, activeTab }) {
  return (
    <div className="flex flex-col gap-2 z-20">
      {ledgers.map((ledger, i) => {
        return <Ledger key={i} {...ledger} activeTab={activeTab} />;
      })}
    </div>
  );
}

function EnvelopeFooter({ displayBalance, addItemHandler }) {
  return (
    <div className="flex flex-row justify-between py-1 z-20">
      <p
        className="font-normal lg:hover:cursor-pointer"
        onClick={addItemHandler}
      >
        Add item
      </p>
      <h2 className="font-medium">{decimal(displayBalance)}</h2>
    </div>
  );
}

function divideAndRoundToNearestTens(balance, n) {
  const baseProduct = (balance / n).toFixed(2);
  const balances = [];
  if ((baseProduct * n).toFixed(2) == balance) {
    for (let i = 0; i < n; i++) {
      balances.push(baseProduct);
    }
    return balances;
  } else {
    for (let i = 0; i < n; i++) {
      if (i === 0) {
        const product = ((baseProduct * 100 + 1) / 100).toFixed(2);
        balances.push(product);
      } else {
        balances.push(baseProduct);
      }
    }
    return balances;
  }
}
