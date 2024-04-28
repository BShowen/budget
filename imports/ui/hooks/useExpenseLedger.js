import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

export function useExpenseLedger({ ledgerId }) {
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
  const percentSpent = Math.min(
    Math.max((moneySpent / (ledger.allocatedAmount + moneyIn)) * 100, 0),
    101
  );

  // If leftToSpend is greater than allocated amount then progress should
  // always be 100. Otherwise progress will be red when it should be
  // green. This can happen when a ledger balance is carried over from
  // a previous month or when a refund is received in a ledger that
  // causes the remaining balance for that ledger to be greater than the
  // allocated amount for that ledger for the month.
  // percentRemaining is bound between 0 and 101, inclusive.
  const percentRemaining =
    leftToSpend > ledger.allocatedAmount
      ? 100
      : Math.min(
          Math.max((leftToSpend / ledger.allocatedAmount) * 100, 0),
          101
        );

  return {
    ...ledger,
    moneySpent,
    moneyReceived: moneyIn,
    leftToSpend,
    transactionList,
    percentSpent,
    percentRemaining,
  };
}
