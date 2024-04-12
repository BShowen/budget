import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { TransactionCollection } from "../../../../api/Transaction/TransactionCollection";
import { EnvelopeCollection } from "../../../../api/Envelope/EnvelopeCollection";

// Utils
import { reduceTransactions } from "../../../util/reduceTransactions";
import { cap } from "../../../util/cap";
import { toDollars } from "../../../util/toDollars";

// Icons
import { LuCheckCircle, LuCircle } from "react-icons/lu";

export function LedgerSelection({
  ledger,
  selected,
  selectLedger,
  deselectLedger,
  transactionType,
}) {
  const balances = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Get the transactions in the ledger.
    const transactions = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();

    let element = "";

    switch (ledger.kind) {
      case "expense":
        if (ledger._id === "uncategorized") {
          break;
        }
        // Calculate this ledgers expense and income from it's transactions
        const { expense, income } = reduceTransactions({ transactions });
        // Calculate how much has been spent out of this ledger.
        const spent = expense - income;
        // Calculate the remaining balance for this ledger.
        const remainingExpense = ledger.allocatedAmount - spent;
        element = (
          <p className="font-semibold text-sm text-color-light-gray">
            Left to spend <span>{toDollars(remainingExpense)}</span>
          </p>
        );
        break;
      case "income":
        // Calculate this ledgers expense and income from it's transactions
        const { income: incomeReceived } = reduceTransactions({ transactions });
        const remainingIncome = ledger.allocatedAmount - incomeReceived;
        element = transactionType === "income" && (
          <p className="font-semibold text-sm text-color-light-gray">
            Left to receive <span>{toDollars(remainingIncome)}</span>
          </p>
        );
        break;
      case "savings":
        const { income: savedThisMonth, expense: spentThisMonth } =
          reduceTransactions({ transactions });
        const savingsBalance =
          ledger.startingBalance + savedThisMonth - spentThisMonth;
        const leftToSave = ledger.allocatedAmount - savedThisMonth;
        element =
          transactionType === "income" ? (
            <p className="font-semibold text-sm text-color-light-gray">
              Left to save <span>{toDollars(leftToSave)}</span>
            </p>
          ) : (
            <p className="font-semibold text-sm text-color-light-gray">
              Balance <span>{toDollars(savingsBalance)}</span>
            </p>
          );
        break;
      case "allocation":
        break;
    }
    return element;
  });
  const envelopeName = useTracker(() => {
    const envelope = EnvelopeCollection.findOne({
      _id: ledger.envelopeId,
    });
    return envelope?.name || "";
  });

  return ledger.kind === "income" && transactionType == "expense" ? (
    // If ledger.kind is income and the user is trying to create an expense,
    // then don't allow the user to select this ledger because and income ledger
    // cannot have an expense.
    ""
  ) : (
    <div
      onClick={
        selected
          ? () => deselectLedger({ ledger })
          : () => selectLedger({ ledger })
      }
      className={`lg:hover:cursor-pointer w-full rounded-xl overflow-hidden px-2 min-h-16 flex flex-row justify-between items-center border transition-all duration-200 mb-2 ${
        selected
          ? "border-green-500 bg-green-100/30"
          : "border-transparent bg-white"
      }`}
    >
      <div className="flex-col justify-start items-stretch">
        <div className="w-full flex flew-row justify-start items-center">
          <p className="font-semibold text-lg">
            {envelopeName && `${cap(envelopeName)} - `}
            {cap(ledger.name)}
          </p>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-1">
          {balances}
        </div>
      </div>
      <div
        className={`h-full w-10 flex flex-col justify-center items-start transition-all duration-200 ${
          selected ? "text-green-600" : "text-color-light-gray"
        }`}
      >
        {selected ? (
          <LuCheckCircle className="w-7 h-7" />
        ) : (
          <LuCircle className="w-7 h-7" />
        )}
      </div>
    </div>
  );
}
