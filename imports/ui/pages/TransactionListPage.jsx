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

// Icons
import { LuSearch, LuXCircle } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";

export function TransactionListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const transactionList = useTracker(() =>
    TransactionCollection.find({}, { sort: { createdAt: -1 } }).fetch()
  );

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
  const transactionCount = filteredTransactionList.length;

  const filterTransactions = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className="page-header z-50 w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-header shadow-sm text-white">
        <div className="flex flex-row items-center p-1 h-11">
          <Link
            className="text-xl font-bold flex flex-row justify-start items-center w-24 lg:hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack className="text-2xl" /> Back
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-start items-stretch mt-12 pb-28 z-0 relative px-2">
        <div className="flex flex-col justify-start gap-4 pt-4 items-center w-full h-28">
          <h2 className="font-bold text-2xl">
            {transactionCount == 1
              ? `${transactionCount} transaction`
              : `${transactionCount} transactions`}
          </h2>
          <SearchBar onInput={filterTransactions} />
        </div>
        <ul className="z-0 mt-5 rounded-xl overflow-hidden shadow-sm">
          {filteredTransactionList.map((transaction, i) => {
            const [month, day] = dates
              .format(transaction.createdAt, {
                forTransaction: true,
              })
              .split(" ");
            return (
              <li
                className={`${i == 0 ? "" : "border-t"} overflow-hidden`}
                key={transaction._id}
              >
                <ListTransaction
                  key={transaction._id}
                  transaction={transaction}
                  options={{ month, day }}
                  ledgerId={transaction.ledgerId}
                />
              </li>
            );
          })}
        </ul>
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
    <div className="w-full px-3 bg-search-bar rounded-full h-10 flex flex-row justify-start items-center overflow-hidden gap-1 shadow-sm">
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
