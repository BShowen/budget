import React, { useState } from "react";

// Components
import { TransactionGroup } from "../components/TransactionGroup";
import { SearchBar } from "../components/SearchBar";
import { NavHeader } from "../components/NavHeader";

// Utils
import { filterTransactions } from "../util/filterTransactions";
import { groupTransactionsByDate } from "../util/groupTransactionsByDate";

// Hooks
import { useTransactions } from "../hooks/useTransactions";

export function TransactionListPage() {
  const [filter, setFilter] = useState("");
  const transactionList = useTransactions();

  // Filter transactions and then group them by date.
  const filteredTransactionList = filterTransactions().bySearchString({
    transactions: transactionList,
    searchString: filter,
  });

  const groupedTransactions = groupTransactionsByDate({
    transactions: filteredTransactionList,
  });

  const transactionCount = filteredTransactionList.length;

  return (
    <>
      <NavHeader
        text={
          transactionCount == 1
            ? `${transactionCount} transaction`
            : `${transactionCount} transactions`
        }
        page="transactions-page"
      />

      <div className="fixed top-0 padding-top-safe-area w-full z-40 bg-search-bar-container-bg-color">
        <div className="w-full flex flex-row justify-start items-center p-2 pt-16 relative z-0">
          <SearchBar
            onInput={(e) => setFilter(e.target.value)}
            transactions={filteredTransactionList}
          />
        </div>
      </div>

      <div className="flex flex-col justify-start items-stretch pb-28 mt-[112px]">
        <div className="z-0">
          {groupedTransactions.map(({ date, transactions }) => (
            <TransactionGroup
              key={date}
              date={date}
              transactions={transactions}
            />
          ))}
        </div>
      </div>
    </>
  );
}
