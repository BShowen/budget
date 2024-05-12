import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

export function useSavingsLedger({ ledgerId, activeTab }) {
  // This is the ledger that is returned from this hook.
  const ledger = useTracker(() => LedgerCollection.findOne({ _id: ledgerId }));

  // This is the list of transactions associated with this ledger.
  const transactionList = useTracker(() => {
    return (
      TransactionCollection.find({
        allocations: { $elemMatch: { ledgerId } },
      })
        .fetch()
        // Map over the list of transactions and set the total of the transaction.
        // Transactions are stored in the database with the "total" set to the
        // sum of all the allocations. If this is a split transaction then only
        // a portion of the transaction total belongs to this ledger's transaction.
        // For example, say we have a single transaction that is split between the
        // ledgers "fast food" and "groceries" totalling $100. $45 allocated to
        // fast food, $55 allocated to groceries. If this ledger is the fast food
        // ledger then the transaction total needs to be $45.
        .map((transaction) => ({
          ...transaction,
          amount: transaction.allocations.reduce((total, allocation) => {
            if (allocation.ledgerId != ledgerId) return total;
            return Math.round((total + allocation.amount) * 100) / 100;
          }, 0),
        }))
    );
  });

  // This is all the money that this ledger has received.
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

  // If moneyIn >= allocatedAmount then leftToSave is zero. Otherwise if
  // moneyIn > allocatedAmount then leftToSave will be a negative number.
  const leftToSave =
    moneyIn >= ledger.allocatedAmount
      ? 0
      : Math.round((ledger.allocatedAmount - moneyIn) * 100) / 100;

  // If moneyIn is >= allocated amount then progress should always be 0.
  // If moneyIn is >= allocated amount then all that means is that the user
  // has saved more money than they expected, so theres nothing left to save.
  const percentRemainingToSave =
    moneyIn >= ledger.allocatedAmount
      ? 0
      : Math.min(Math.max((leftToSave / ledger.allocatedAmount) * 100, 0), 101);

  // Total money saved this month, represented as a percentage
  // If ledger.allocatedAmount is zero then percentSaved cannot be calculated
  // so return 0. This is to avoid dividing by zero.
  const percentSaved =
    ledger.allocatedAmount > 0
      ? Math.min(
          Math.max(Math.round((moneyIn / ledger.allocatedAmount) * 100), 0),
          100
        )
      : 0;

  const savingsBalance =
    Math.round((ledger.startingBalance + moneyIn - moneyOut) * 100) / 100;

  // If active tab is true, then calculate the display balance for that tab.
  // If active tab is not true then return the current balance of this ledger.
  const displayBalance = activeTab
    ? activeTab === "planned"
      ? ledger.allocatedAmount
      : activeTab === "spent"
      ? moneyOut
      : leftToSave
    : savingsBalance;

  // If active tab is true then calculate the progress percent for that tab.
  // If active tab is not true then return percent saved.
  const progressPercentage = activeTab
    ? activeTab === "planned"
      ? 0
      : activeTab === "spent"
      ? 0
      : percentRemainingToSave //activeTab === "remaining"
    : percentSaved;

  return {
    ...ledger,
    moneySpent: moneyOut,
    moneyReceived: moneyIn,
    leftToSave,
    transactionList,
    percentRemainingToSave,
    savingsBalance,
    percentSaved,
    displayBalance,
    progressPercentage,
  };
}
