import React, { useState, useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Components
import { ListTransaction } from "../components/ListTransaction";

// Collections
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { dates } from "../util/dates";
import { toDollars } from "../util/toDollars";

// Icons
import {
  LuArrowDown01,
  LuArrowDown10,
  LuArrowDownZA,
  LuArrowDownAZ,
  LuSearch,
  LuXCircle,
} from "react-icons/lu";

export function TransactionListPage() {
  // const [sortOrder, setSortOrder] = useState("asc");
  // const [sortProperty, setSortProperty] = useState("createdAt");
  // const toggleSortOrder = () => {
  //   setSortOrder((prev) => {
  //     if (prev == "asc") {
  //       return "desc";
  //     } else {
  //       return "asc";
  //     }
  //   });
  // };
  // const transactionList = useTracker(() => {
  //   const transactions = TransactionCollection.find().fetch();

  //   switch (sortProperty) {
  //     case "createdAt":
  //       return transactions.sort((a, b) => {
  //         if (sortOrder == "asc") {
  //           return b[sortProperty] - a[sortProperty];
  //         } else {
  //           return a[sortProperty] - b[sortProperty];
  //         }
  //       });
  //     case "merchant":
  //       if (sortOrder == "asc") {
  //         return transactions.sort(
  //           (a, b) =>
  //             b[sortProperty].charCodeAt(0) - a[sortProperty].charCodeAt(0)
  //         );
  //       } else {
  //         return transactions.sort(
  //           (a, b) =>
  //             a[sortProperty].charCodeAt(0) - b[sortProperty].charCodeAt(0)
  //         );
  //       }
  //     case "amount":
  //       if (sortOrder == "asc") {
  //         return transactions.sort((a, b) => {
  //           return a.amount - b.amount;
  //         });
  //       } else {
  //         return transactions.sort((a, b) => {
  //           return b.amount - a.amount;
  //         });
  //       }
  //     default:
  //       return transactions;
  //   }
  // }, [sortOrder]);

  // const toolbarOptions = {
  //   sortOrder: sortOrder,
  //   toggleSortOrder: toggleSortOrder,
  //   sortProperty: sortProperty,
  //   setSortProperty: setSortProperty,
  // };
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
      toDollars(transactionAmount.toString()).includes(searchFilter)
    );
  });
  const transactionCount = filteredTransactionList.length;

  const filterTransactions = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className="empty-page-header bg-header"></div>
      <div className="flex flex-col justify-start items-stretch p-2 pb-28 gap-5 bg-gray-100">
        <Insights />
        <div className="bg-white pt-2 pb-3 rounded-xl flex flex-col">
          <div className="sticky position-top-safe z-20 bg-white gap-2 p-2 rounded-xl">
            <div className="w-full text-center">
              <h2 className="font-bold text-xl">
                {transactionCount == 1
                  ? `${transactionCount} transaction`
                  : `${transactionCount} transactions`}
              </h2>
            </div>
            <SearchBar onInput={filterTransactions} />
          </div>
          <ul className="list-none z-0">
            {filteredTransactionList.map((transaction, i) => {
              const [month, day] = dates
                .format(transaction.createdAt, {
                  forTransaction: true,
                })
                .split(" ");
              return (
                <li
                  className={`${
                    i == transactionCount - 1 ? "border-t border-b" : "border-t"
                  } overflow-hidden`}
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
      </div>
    </>
  );
}

function Insights() {
  const anticipatedIncome = useTracker(() =>
    LedgerCollection.find(
      { kind: "income" },
      { fields: { allocatedAmount: true } }
    )
      .fetch()
      .reduce((acc, ledger) => acc + ledger.allocatedAmount, 0)
  );

  const incomeReceived = useTracker(() => {
    // Get all transactions that belong to the income envelope and accumulate
    // their totals into a single dollar amount.
    const incomeEnvelope = EnvelopeCollection.findOne(
      { kind: "income" },
      { fields: { _id: true } }
    );

    return TransactionCollection.find(
      { envelopeId: incomeEnvelope._id },
      { fields: { amount: true } }
    )
      .fetch()
      .reduce((acc, tx) => acc + tx.amount, 0);
  });

  const spentSoFar = useTracker(() => {
    // Get all transactions that do not belong to incomeEnvelope or savingsEnvelope
    const [env1, env2] = EnvelopeCollection.find(
      { $or: [{ kind: "income" }, { kind: "savings" }] },
      { fields: { _id: true } }
    ).fetch();

    return TransactionCollection.find(
      {
        $and: [
          { envelopeId: { $not: env1._id } },
          { envelopeId: { $not: env2._id } },
        ],
      },
      { fields: { amount: true, type: true } }
    )
      .fetch()
      .reduce((acc, tx) => {
        if (tx.type == "expense") {
          return Math.floor((acc + tx.amount) * 100) / 100;
        } else {
          return Math.floor((acc - tx.amount) * 100) / 100;
        }
      }, 0);
  });

  // This is the sum of all the income transactions in allocation ledgers.
  const allocations = useTracker(() => {
    // An array of all allocation ledger id's.
    const allocationLedgers = LedgerCollection.find({ kind: "allocation" })
      .fetch()
      .map((ledger) => ledger._id);
    /* prettier-ignore */
    // Get all income transactions associated with the allocations
    const transactions = TransactionCollection.find({
      $and: [
        { ledgerId: { $in: allocationLedgers } },
        { type: "income" }
      ],
    }).fetch();
    // Sum the transaction totals.
    const sum = transactions.reduce((acc, transaction) => {
      return Math.floor((acc + transaction.amount) * 100) / 100;
    }, 0);
    return sum;
  });

  // This is the sum of all the income transactions in the savings ledgers.
  const savings = useTracker(() => {
    // An array of all savings ledger id's
    const savingsLedgerIdList = LedgerCollection.find({ kind: "savings" })
      .fetch()
      ?.map((ledger) => ledger._id);
    /* prettier-ignore */
    // Get a list of all the transactions associated with the saving ledgers.
    const transactions = TransactionCollection.find({
      $and: [
        { ledgerId: { $in: savingsLedgerIdList } },
        { type: "income" }
      ],
    }).fetch();
    // Sum the total of all the transactions.
    const sum = transactions.reduce((acc, transaction) => {
      return Math.floor((transaction.amount + acc) * 100) / 100;
    }, 0);
    return sum;
  });

  return (
    <div className="w-full flex flex-col justify-start items-stretch font-semibold gap-2">
      <div className="bg-white rounded-xl p-2 flex flex-col gap-1">
        <h1 className="text-lg font-bold">Income</h1>

        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Expected</div>
          <div>{toDollars(anticipatedIncome)}</div>
        </div>

        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Received</div>
          <div>{toDollars(incomeReceived)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 flex flex-col gap-1">
        <h1 className="text-lg font-bold ">Saved</h1>

        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Savings</div>
          <div>{toDollars(Math.floor(savings * 100) / 100)}</div>
        </div>

        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Allocations</div>
          <div>{toDollars(Math.floor(allocations * 100) / 100)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 flex flex-col gap-1">
        <h1 className="text-xl font-bold ">Spent</h1>
        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Spent this month</div>
          <div>{toDollars(spentSoFar)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 flex flex-col gap-1">
        <h1 className="text-xl font-bold ">Remaining</h1>
        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Left to spend</div>
          <div>
            {toDollars(
              Math.floor(
                (incomeReceived - spentSoFar - savings - allocations) * 100
              ) / 100
            )}
          </div>
        </div>
      </div>
    </div>
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
    <div className="px-1 bg-search-bar rounded-xl h-10 flex flex-row justify-start items-center overflow-hidden shadow-sm shadow-gray-300 gap-1">
      {icon}
      <input
        ref={searchBarRef}
        className="border-none h-10 w-full bg-inherit outline-none text-lg font-semibold placeholder:font-normal"
        type="text"
        placeholder="Search"
        value={searchString}
        onChange={updateSearch}
      />
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

function Toolbar(options) {
  return (
    <div className="sticky position-top-safe px-1 bg-gray-50 rounded-xl h-11 shadow-md mb-3">
      <div className="w-full h-full flex flex-row justify-center items-stretch gap-1 font-bold text-sm py-1">
        <SortByDate {...options} />
        <SortByName {...options} />
        <SortByAmount {...options} />
      </div>
    </div>
  );
}

function SortByDate({
  toggleSortOrder,
  sortOrder,
  sortProperty,
  setSortProperty,
}) {
  return (
    <div
      className={`px-2 flex flex-row justify-center items-center gap-1 rounded-lg md:hover:cursor-pointer grow basis-0 ${
        sortProperty == "createdAt" ? "bg-gray-300" : "bg-gray-100"
      }`}
      onClick={() => {
        setSortProperty("createdAt");
        toggleSortOrder();
      }}
    >
      <button>Date</button>
      {sortProperty == "createdAt" ? (
        sortOrder == "asc" ? (
          <LuArrowDown10 className="text-2xl" />
        ) : (
          <LuArrowDown01 className="text-2xl" />
        )
      ) : (
        ""
      )}
    </div>
  );
}

function SortByName({
  toggleSortOrder,
  sortOrder,
  sortProperty,
  setSortProperty,
}) {
  return (
    <div
      className={`px-2 flex flex-row justify-center items-center gap-1 rounded-lg md:hover:cursor-pointer grow basis-0 ${
        sortProperty == "merchant" ? "bg-gray-300" : "bg-gray-100"
      }`}
      onClick={() => {
        setSortProperty("merchant");
        toggleSortOrder();
      }}
    >
      <button>Name</button>
      {sortProperty == "merchant" ? (
        sortOrder == "asc" ? (
          <LuArrowDownZA className="text-2xl" />
        ) : (
          <LuArrowDownAZ className="text-2xl" />
        )
      ) : (
        ""
      )}
    </div>
  );
}

function SortByAmount({
  toggleSortOrder,
  sortOrder,
  sortProperty,
  setSortProperty,
}) {
  return (
    <div
      className={`px-2 flex flex-row justify-center items-center gap-1 rounded-lg md:hover:cursor-pointer grow basis-0 ${
        sortProperty == "amount" ? "bg-gray-300" : "bg-gray-100"
      }`}
      onClick={() => {
        setSortProperty("amount");
        toggleSortOrder();
      }}
    >
      <button>Amount</button>
      {sortProperty == "amount" ? (
        sortOrder == "asc" ? (
          <LuArrowDown01 className="text-2xl" />
        ) : (
          <LuArrowDown10 className="text-2xl" />
        )
      ) : (
        ""
      )}
    </div>
  );
}
