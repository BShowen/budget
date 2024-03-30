import React, { useState, useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useNavigate } from "react-router-dom";

// Components
import { ListTransaction } from "../components/ListTransaction";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { dates } from "../util/dates";
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";

// Icons
import { LuSearch, LuXCircle } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { LuMoveDown, LuMoveUp } from "react-icons/lu";

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
      <div className="page-header z-50 w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-header shadow-sm text-white">
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
      <div className="mt-11 h-16 fixed position-top-safe w-full lg:w-3/5 z-50 px-2 flex flex-col justify-center items-stretch bg-app">
        <SearchBar onInput={filterTransactions} />
      </div>
      <div className="flex flex-col justify-start items-stretch pb-28 mt-28">
        <div className="z-0 shadow-sm bg-white">{transactionGroups}</div>
      </div>
    </>
  );
}

function SearchBar({ onInput }) {
  // Store the string the user has typed, if any.
  // If the string.length > 0 then show the reset button.
  const [searchString, setSearchString] = useState("");
  const searchBarRef = useRef(null);
  const icon =
    searchString.length > 0 ? (
      <LuXCircle
        className="text-2xl lg:hover:cursor-pointer lg:hover:text-red-500"
        onClick={resetSearch}
      />
    ) : (
      <LuSearch className="text-2xl" />
    );

  return (
    <div className="w-full px-3 bg-search-bar rounded-full min-h-10 flex flex-row justify-start items-center overflow-hidden gap-1 shadow-sm">
      <input
        ref={searchBarRef}
        className="border-none h-10 w-full bg-inherit outline-none text-lg font-semibold placeholder:font-normal"
        type="text"
        placeholder="Search"
        value={searchString}
        onChange={updateSearch}
      />
      {icon}
    </div>
  );

  function resetSearch() {
    setSearchString("");
    // Call the onInput argument to reset the search filter.
    onInput({ target: { value: "" } });
    searchBarRef.current.focus();
  }

  function updateSearch(e) {
    setSearchString(e.target.value);
    onInput(e);
  }
}

function TransactionGroup({ date, transactions }) {
  const { income, expense } = reduceTransactions({ transactions });
  return (
    <div key={date}>
      <div className="list-transaction-date font-extrabold">
        <div className="min-w-fit">
          <h2 className="font-extrabold">
            {new Date(date).toLocaleString("en-us", {
              month: "long",
              day: "numeric",
            })}
          </h2>
        </div>
        <div className="flex flex-row justify-end gap-4 items-center grow">
          <div className="text-green-500 flex flex-row items-center">
            <LuMoveDown />
            <p>{toDollars(income)}</p>
          </div>
          <div className="text-red-500 flex flex-row items-center">
            <LuMoveUp />
            <p>{toDollars(expense)}</p>
          </div>
        </div>
      </div>
      {transactions.map((transaction) => {
        // Add the transactions to the list
        const [month, day] = dates
          .format(transaction.createdAt, { forTransaction: true })
          .split(" ");
        return (
          <ListTransaction
            key={transaction._id}
            transaction={transaction}
            options={{ month, day }}
            ledgerId={transaction.ledgerId}
          />
        );
      })}
    </div>
  );
}
