import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import { TransactionGroup } from "../components/TransactionGroup";
import { SearchBar } from "../components/SearchBar";

// Utils
import { filterTransactions } from "../util/filterTransactions";
import { groupTransactionsByDate } from "../util/groupTransactionsByDate";

// Icons
import { IoIosArrowBack } from "react-icons/io";

// Hooks
import { useTransactions } from "../hooks/useTransactions";

export function TransactionListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const transactionList = useTransactions();
  console.log({ transactionList });

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
      <div className="page-header z-50 w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-primary-blue dark:bg-blue-800 shadow-sm text-white">
        <div className="flex flex-row items-center p-1 h-11 z-50">
          <Link
            className="text-xl font-bold flex flex-row justify-start items-center w-24 lg:hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack className="text-2xl" /> Back
          </Link>
        </div>
        <div className="fixed text-center w-full lg:w-3/5 z-40">
          <h1 className="font-bold text-lg">
            {transactionCount == 1
              ? `${transactionCount} transaction`
              : `${transactionCount} transactions`}
          </h1>
        </div>
      </div>
      <div className="mt-11 h-16 fixed position-top-safe w-full lg:w-3/5 z-50 px-1 flex flex-row justify-start items-center bg-slate-100 dark:bg-dark-mode-bg-0">
        <SearchBar
          onInput={(e) => setFilter(e.target.value)}
          transactions={filteredTransactionList}
        />
      </div>
      <div className="flex flex-col justify-start items-stretch pb-28 mt-28">
        <div className="z-0 shadow-sm">
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
