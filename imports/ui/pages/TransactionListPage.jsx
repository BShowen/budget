import React, { useState, useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useNavigate } from "react-router-dom";

// Components
import { ListTransaction } from "../components/ListTransaction";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";

// Icons
import { LuSearch, LuXCircle } from "react-icons/lu";
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
      <div className="mt-11 h-16 fixed position-top-safe w-full lg:w-3/5 z-50 px-2 flex flex-row justify-start items-center bg-slate-100">
        <SearchBar onInput={filterTransactions} />
        <SearchBarTotal transactions={filteredTransactionList} />
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
    <div
      className={`${
        searchString ? "w-4/6" : "w-full"
      } z-50 px-3 bg-search-bar rounded-full min-h-10 flex flex-row justify-start items-center overflow-hidden gap-1 shadow-sm transition-all duration-300 ease-in-out`}
    >
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

function SearchBarTotal({ transactions }) {
  const { income, expense } = reduceTransactions({ transactions });
  return (
    <div className="absolute right-[10px] w-2/6 flex flex-row justify-center items-center rounded-e-full min-h-8 border-blue-500 border-2 font-semibold z-40">
      <p>{toDollars(Math.round((expense - income) * 100) / 100)}</p>
    </div>
  );
}

function TransactionGroup({ date, transactions }) {
  return (
    <div key={date}>
      <div className="list-transaction-date">
        <h2>
          {new Date(date).toLocaleString("en-us", {
            month: "long",
            day: "numeric",
          })}
        </h2>
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
