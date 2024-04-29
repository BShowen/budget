import { useTracker } from "meteor/react-meteor-data";

// Collections
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
export function useExpenseCategory({ envelopeId, activeTab }) {
  const envelope = useTracker(() => {
    return EnvelopeCollection.findOne({ _id: envelopeId });
  });

  const ledgerList = useTracker(() => {
    return LedgerCollection.find({ envelopeId }).fetch();
  });

  const transactionList = useTracker(() => {
    return (
      TransactionCollection.find({
        allocations: { $elemMatch: { envelopeId } },
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
            if (allocation.envelopeId != envelopeId) return total;
            return Math.round((total + allocation.amount) * 100) / 100;
          }, 0),
        }))
    );
  });

  const moneyIn = transactionList
    .filter(({ type }) => type == "income")
    .reduce((total, { amount }) => Math.round((amount + total) * 100) / 100, 0);

  const moneyOut = transactionList
    .filter(({ type }) => type == "expense")
    .reduce((total, { amount }) => Math.round((amount + total) * 100) / 100, 0);

  // Take into consideration any refunds or leftover balances.
  const spent = Math.round((moneyOut - moneyIn) * 100) / 100;

  const envelopeBalance = ledgerList.reduce((total, ledger) => {
    return Math.round((ledger.allocatedAmount + total) * 100) / 100;
  }, 0);

  const leftToSpend = Math.round((envelopeBalance - spent) * 100) / 100;

  const displayBalance = activeTab
    ? activeTab === "spent"
      ? spent
      : activeTab === "remaining"
      ? leftToSpend
      : envelopeBalance
    : 0;

  return {
    ...envelope,
    transactionList,
    ledgerList,
    moneyIn,
    moneyOut,
    spent,
    balance: envelopeBalance,
    leftToSpend,
    displayBalance,
  };
}
