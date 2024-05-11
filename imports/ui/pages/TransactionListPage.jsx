import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useNavigate } from "react-router-dom";

// Components
import { TransactionGroup } from "../components/TransactionGroup";
import { SearchBar } from "../components/SearchBar";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { toDollars } from "../util/toDollars";

// Icons
import { IoIosArrowBack } from "react-icons/io";

export function TransactionListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const transactionList = useTracker(() =>
    TransactionCollection.find({}, { sort: { createdAt: -1 } }).fetch()
  );

  // Filter transactions and then group them by date.
  const filteredTransactionList = transactionList.filter((transaction) => {
    const transactionName = transaction.merchant;
    const transactionAmount = transaction.amount;
    const searchFilter = filter.toLowerCase();

    return (
      transactionName.includes(searchFilter) ||
      toDollars(transactionAmount.toString()).includes(searchFilter) ||
      toDollars(transactionAmount.toString())
        .split(",")
        .join("")
        .includes(searchFilter)
    );
  });

  const groupedTransactions = filteredTransactionList.reduce(
    (acc, transaction) => ({
      ...acc,
      [transaction.createdAt]: [
        ...(acc[transaction.createdAt] || []),
        transaction,
      ],
    }),
    {}
  );

  const transactionCount = filteredTransactionList.length;

  const filterTransactions = (e) => {
    setFilter(e.target.value);
  };

  const transactionGroups = [];
  for (const date in groupedTransactions) {
    // add the date element to the list
    transactionGroups.push(
      <TransactionGroup
        key={date}
        date={date}
        transactions={groupedTransactions[date]}
      />
    );
  }

  return (
    <>
      <div className="page-header z-50 w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-primary-blue shadow-sm text-white">
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
          onInput={filterTransactions}
          transactions={filteredTransactionList}
        />
      </div>
      <div className="flex flex-col justify-start items-stretch pb-28 mt-28">
        <div className="z-0 shadow-sm">{transactionGroups}</div>
      </div>
    </>
  );
}
