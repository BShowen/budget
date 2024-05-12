import React from "react";
import { useLocation } from "react-router-dom";

// Components
import { ListTransaction } from "./ListTransaction";

export function TransactionGroup({ date, transactions }) {
  const location = useLocation();

  const displayDate = new Date(date).toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  // Matches /ledger/jwX3SiMwTY5jjy9nF/transactions
  const regex = /\/ledger\/[a-zA-Z0-9]+\/transactions/;

  const style =
    location.pathname === "/transactions"
      ? `top-108px`
      : regex.test(location.pathname)
      ? `top-56px`
      : "";

  return (
    <div key={date}>
      <div
        className={`${style} dark:bg-dark-mode-bg-0 dark:text-dark-mode-text-0 flex flex-row bg-slate-100 justify-start items-center px-2 py-1 sticky z-0 h-8 font-medium`}
      >
        <h2>{displayDate}</h2>
      </div>
      {transactions.map((transaction, i) => {
        const isBordered = i != transactions.length - 1;
        return (
          <ListTransaction
            transactionId={transaction._id}
            isBordered={isBordered}
            key={i}
          />
        );
      })}
    </div>
  );
}
