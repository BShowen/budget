import React, { useState } from "react";
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
} from "react-icons/lu";

export function TransactionsPage() {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortProperty, setSortProperty] = useState("createdAt");
  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev == "asc") {
        return "desc";
      } else {
        return "asc";
      }
    });
  };
  const transactionList = useTracker(() => {
    const transactions = TransactionCollection.find().fetch();

    switch (sortProperty) {
      case "createdAt":
        return transactions.sort((a, b) => {
          if (sortOrder == "asc") {
            return b[sortProperty] - a[sortProperty];
          } else {
            return a[sortProperty] - b[sortProperty];
          }
        });
      case "merchant":
        if (sortOrder == "asc") {
          return transactions.sort(
            (a, b) =>
              b[sortProperty].charCodeAt(0) - a[sortProperty].charCodeAt(0)
          );
        } else {
          return transactions.sort(
            (a, b) =>
              a[sortProperty].charCodeAt(0) - b[sortProperty].charCodeAt(0)
          );
        }
      case "amount":
        if (sortOrder == "asc") {
          return transactions.sort((a, b) => {
            return a.amount - b.amount;
          });
        } else {
          return transactions.sort((a, b) => {
            return b.amount - a.amount;
          });
        }
      default:
        return transactions;
    }
  }, [sortOrder]);

  const toolbarOptions = {
    sortOrder: sortOrder,
    toggleSortOrder: toggleSortOrder,
    sortProperty: sortProperty,
    setSortProperty: setSortProperty,
  };

  return (
    <>
      <div className="empty-page-header"></div>
      <div className="flex flex-col justify-start items-stretch p-2 pb-28 gap-5 bg-gray-100">
        <Insights />
        <div className="bg-white py-2 rounded-xl flex flex-col gap-2">
          <div className="w-full text-center">
            <h2 className="font-bold text-xl">
              {transactionList.length} Transactions this month
            </h2>
          </div>
          {transactionList.length > 0 && <Toolbar {...toolbarOptions} />}
          <ul className="list-none">
            {transactionList.map((transaction) => {
              const [month, day] = dates
                .format(transaction.createdAt, {
                  forTransaction: true,
                })
                .split(" ");
              return (
                <li className="border-t" key={transaction._id}>
                  <ListTransaction
                    key={transaction._id}
                    transaction={transaction}
                    options={{ month, day }}
                    ledgerId={transaction.ledgerId}
                    transactionId={transaction._id}
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
          return acc + tx.amount;
        } else {
          return acc - tx.amount;
        }
      }, 0);
  });
  return (
    <div className="bg-white p-2 rounded-xl">
      <div className="w-full text-center text-xl font-bold h-10">
        <h1>Overview</h1>
      </div>
      <div className="w-full flex flex-col justify-start items-stretch font-semibold">
        <div className="w-full flex flex-row justify-between">
          <div>Income expected this month</div>
          <div>{toDollars(anticipatedIncome)}</div>
        </div>
        <div className="w-full flex flex-row justify-between">
          <div>Income received so far</div>
          <div>{toDollars(incomeReceived)}</div>
        </div>
        <div className="w-full flex flex-row justify-between border-b">
          <div>Total spent so far</div>
          <div>{toDollars(spentSoFar)}</div>
        </div>
        <div className="w-full flex flex-row justify-between">
          <div>Remaining</div>
          <div>{toDollars(incomeReceived - spentSoFar)}</div>
        </div>
      </div>
    </div>
  );
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
