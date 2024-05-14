import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";

// Hooks
import { useTransactions } from "../hooks/useTransactions";

export function useIncomeLedger({ ledgerId, activeTab }) {
  // This is the ledger that is returned from this hook.
  const ledger = useTracker(() => LedgerCollection.findOne({ _id: ledgerId }));

  // This is the list of transactions associated with this ledger.
  const transactionList = useTransactions({ ledgerId });

  // This is all the money that this ledger has received.
  const moneyIn = transactionList
    .filter((doc) => doc.type == "income")
    .reduce(
      (total, transaction) =>
        Math.round((transaction.amount + total) * 100) / 100,
      0
    );

  // The income left to receive. A dollar amount.
  const leftToReceive =
    ledger.allocatedAmount > 0
      ? Math.round((ledger.allocatedAmount - moneyIn) * 100) / 100
      : 0;

  // The income left to receive represented as a percentage.
  const percentRemainingToReceive = Math.round(
    (leftToReceive / ledger.allocatedAmount) * 100
  );

  // The income that has been received, represented as a percentage.
  const percentIncomeReceived = Math.round(
    (moneyIn / ledger.allocatedAmount) * 100
  );

  // If active tab is true, then calculate the display balance for that tab.
  // If active tab is not true then return the current balance of this ledger.
  const displayBalance = activeTab
    ? activeTab === "planned"
      ? ledger.allocatedAmount
      : activeTab === "spent"
      ? moneyIn
      : leftToReceive
    : moneyIn;

  // If active tab is true then calculate the progress percent for that tab.
  // If active tab is not true then return percent received.
  const progressPercentage = activeTab
    ? activeTab === "planned"
      ? 0
      : activeTab === "spent"
      ? percentIncomeReceived
      : percentRemainingToReceive //activeTab === "remaining"
    : percentIncomeReceived;

  return {
    ...ledger,
    incomeReceived: moneyIn,
    leftToReceive,
    transactionList,
    percentRemainingToReceive,
    percentIncomeReceived,
    displayBalance,
    progressPercentage,
  };
}
