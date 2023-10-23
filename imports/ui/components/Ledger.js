import React from "react";

// Utils
import { cap } from "../util/cap";
import { decimal } from "../util/decimal";

// Components
import { Progress } from "./Progress";

export const Ledger = ({ name, startingBalance, transactions, activeTab }) => {
  const spent = transactions.reduce((acc, transaction) => {
    return acc + transaction.amount;
  }, 0);
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
    <div>
      <div className="flex flex-row justify-between items-center px-2 bg-slate-100 rounded-md py-1 lg:hover:cursor-pointer h-8 relative">
        <h2 className="font-semibold">{cap(name)}</h2>
        <h2 className="font-normal">{decimal(displayBalance)}</h2>
        <Progress percent={progress} />
      </div>
    </div>
  );
};
