import { useTracker } from "meteor/react-meteor-data";

// Hooks
import { useTransactions } from "./useTransactions";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";

export function useExpenseLedger({ ledgerId, activeTab }) {
  // This is the ledger that is returned from this hook.
  const ledger = useTracker(() => LedgerCollection.findOne({ _id: ledgerId }));

  // This is the list of transactions associated with this ledger.
  const transactionList = useTransactions({ ledgerId });

  // This is all the money that this ledger has received. Think refunds or
  // leftover balance from the previous month etc.
  const moneyIn = transactionList
    .filter((doc) => doc.type == "income")
    .reduce(
      (total, transaction) =>
        Math.round((transaction.amount + total) * 100) / 100,
      0
    );

  // This is all the money that has left this ledger.
  const moneyOut = transactionList
    .filter((doc) => doc.type == "expense")
    .reduce(
      (total, transaction) =>
        Math.round((transaction.amount + total) * 100) / 100,
      0
    );

  // This is how much money is left in this ledger.
  // This is calculated by taking the allocated amount + money in - money out
  const leftToSpend =
    Math.round((ledger.allocatedAmount + moneyIn - moneyOut) * 100) / 100;

  // This is how much money has been spent out of this ledger.
  // This is calculated by taking the money out + money in.
  // This way any refunds or leftover balances are taken into this calculation.
  const moneySpent = Math.round((moneyOut - moneyIn) * 100) / 100;

  // progressSpent is bound between 0 and 101, inclusive.
  const percentSpent =
    ledger.allocatedAmount + moneyIn > 0
      ? Math.min(
          Math.max((moneySpent / (ledger.allocatedAmount + moneyIn)) * 100, 0),
          101
        )
      : 0;

  // If leftToSpend is greater than allocated amount then progress should
  // always be 100. Otherwise progress will be red when it should be
  // green. This can happen when a ledger balance is carried over from
  // a previous month or when a refund is received in a ledger that
  // causes the remaining balance for that ledger to be greater than the
  // allocated amount for that ledger for the month.
  // percentRemaining is bound between 0 and 101, inclusive.
  const percentRemaining =
    ledger.allocatedAmount > 0
      ? leftToSpend > ledger.allocatedAmount
        ? 100
        : Math.min(
            Math.max((leftToSpend / ledger.allocatedAmount) * 100, 0),
            101
          )
      : 0;

  // If active tab is true, then calculate the display balance for that tab.
  // If active tab is not true then return the current balance of this ledger.
  const displayBalance = activeTab
    ? activeTab === "planned"
      ? ledger.allocatedAmount
      : activeTab === "spent"
      ? moneySpent
      : leftToSpend //Remaining
    : leftToSpend;

  // If active tab is true then calculate the progress percent for that tab.
  // If active tab is not true then return percent spent.
  const progressPercentage = activeTab
    ? activeTab === "planned"
      ? 0
      : activeTab === "spent"
      ? percentSpent
      : percentRemaining //remaining
    : percentRemaining;

  // Boolean indicating whether or not this ledger is over draft.
  const isOverSpent = leftToSpend < 0;

  return {
    ...ledger,
    moneySpent,
    moneyReceived: moneyIn,
    leftToSpend,
    transactionList,
    percentSpent,
    percentRemaining,
    displayBalance,
    progressPercentage,
    isOverSpent,
  };
}
