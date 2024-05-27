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
      ? `top-110px`
      : regex.test(location.pathname)
      ? `top-56px`
      : "";

  return (
    <div key={date}>
      <div
        className={`${style} bg-transaction-group-bg-color text-transaction-group-text-color flex flex-row justify-start items-center px-2 py-1 sticky z-0 h-8 font-medium`}
      >
        <h2>{displayDate}</h2>
      </div>
      <div className="border-b border-transaction-group-border-color">
        {transactions.map((transaction, i) => {
          const isBordered = i != transactions.length - 1;
          return (
            <ListTransaction
              transaction={transaction}
              isBordered={isBordered}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
}
