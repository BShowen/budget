import React from "react";

// Components
import { ListTransaction } from "./ListTransaction";

export function TransactionGroup({ date, transactions }) {
  const displayDate = new Date(date).toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <div key={date}>
      <div className="list-transaction-date">
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
