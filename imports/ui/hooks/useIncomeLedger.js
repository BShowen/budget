import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

export function useIncomeLedger({ ledgerId }) {
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

  // The income left to receive. A dollar amount.
  const leftToReceive =
    Math.round((ledger.allocatedAmount - moneyIn) * 100) / 100;

  // The income left to receive represented as a percentage.
  const percentRemainingToReceive = Math.round(
    (leftToReceive / ledger.allocatedAmount) * 100
  );

  // The income that has been received, represented as a percentage.
  const percentIncomeReceived = Math.round(
    (moneyIn / ledger.allocatedAmount) * 100
  );

  return {
    ...ledger,
    incomeReceived: moneyIn,
    leftToReceive,
    transactionList,
    percentRemainingToReceive,
    percentIncomeReceived,
  };
}
