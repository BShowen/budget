import React from "react";

// Utils
import { cap } from "../util/cap";
import { decimal } from "../util/decimal";

// Components
import { Ledger } from "./Ledger";
import { Progress } from "./Progress";

export const Envelope = ({ name, startingBalance, ledgers, activeTab }) => {
  const spent = ledgers.reduce((acc1, ledger) => {
    return (
      acc1 +
      ledger.transactions.reduce((acc2, transaction) => {
        return acc2 + transaction.amount;
      }, 0)
    );
  }, 0);
  const remaining = startingBalance - spent;
  const displayBalance =
    activeTab === "spent"
      ? spent
      : activeTab === "remaining"
      ? remaining
      : startingBalance;

  return (
    // Envelope container
    <div className="bg-white rounded-lg shadow-md flex flex-col items-stretch px-2 pt-1 gap-2">
      {/* Envelope header */}
      <div className="flex flex-row justify-between p-1 pb-2 relative h-8 border-2">
        <h1 className="font-bold">{cap(name)}</h1>
        <h2 className="font-semibold">{cap(activeTab)}</h2>
        {/* <Progress percent={50} /> */}
      </div>
      {/* Envelope body */}
      <div className="flex flex-col gap-2">
        {ledgers.map((ledger, i) => {
          return <Ledger key={i} {...ledger} activeTab={activeTab} />;
        })}
      </div>
      {/* Envelope footer */}
      <div className="flex flex-row justify-between py-1">
        <p className="font-normal lg:hover:cursor-pointer">Add item</p>
        <h2 className="font-medium">{decimal(displayBalance)}</h2>
      </div>
    </div>
  );
};
