import React, { useState, useRef } from "react";

// Utils
import { reduceTransactions } from "../util/reduceTransactions";
import { toDollars } from "../util/toDollars";

// Icons
import { LuSearch, LuXCircle } from "react-icons/lu";

export function SearchBar({ onInput, transactions }) {
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
    <div className="relative w-full">
      <div
        className={`${
          searchString ? "w-8/12" : "w-full"
        } z-50 px-3 bg-search-bar dark:bg-dark-mode-bg-1 rounded-full min-h-10 max-h-10 flex flex-row justify-start items-center overflow-hidden gap-1 shadow-sm transition-all duration-300 ease-in-out relative`}
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
      <SearchBarTotal transactions={transactions} />
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
    <div className="absolute top-0 bottom-0 right-0 w-5/12 flex flex-col justify-center">
      <div className="w-full flex flex-row justify-center items-center rounded-e-full min-h-[35px] max-h-[35px] font-semibold z-40 dark:bg-dark-mode-bg-3">
        <p>{toDollars(Math.round((expense - income) * 100) / 100)}</p>
      </div>
    </div>
  );
}
