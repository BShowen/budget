// Collections
import { EnvelopeCollection } from "../../../api/Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../../api/Ledger/LedgerCollection";
import { TagCollection } from "../../../api/Tag/TagCollection";

// A function that takes in a transaction object and returns a copy with some
// extra fields of information.
export function populateTransaction({ transaction, ledgerId, envelopeId }) {
  // This is an array of category documents that this transaction belongs too
  const categoryList = EnvelopeCollection.find(
    {
      _id: {
        $in: transaction.allocations.map(({ envelopeId }) => envelopeId),
      },
    },
    { fields: { name: true, _id: true } }
  ).fetch();

  // This is an array of ledger documents that this transaction belongs too

  const ledgerList = LedgerCollection.find(
    {
      _id: { $in: transaction.allocations.map(({ ledgerId }) => ledgerId) },
    },
    { fields: { name: true, _id: true, envelopeId: true } }
  ).fetch();

  // This is an array of sub-arrays. Each sub array contains the category name
  // and the ledger name that this transaction belongs to.
  const categoryAndLedgerNameList = ledgerList.reduce(
    (acc, { name: ledgerName, envelopeId }) => {
      const { name: categoryName } = categoryList.find(
        ({ _id }) => _id === envelopeId
      );
      return [...acc, [categoryName, ledgerName]];
    },
    [...(transaction.isCategorized ? [] : [["uncategorized"]])]
  );

  const categoryNameList = [
    ...categoryList.map(({ name }) => name),
    ...(transaction.isCategorized ? [] : ["uncategorized"]),
  ];

  const ledgerNameList = [
    ...ledgerList.map(({ name }) => name),
    ...(transaction.isCategorized ? [] : "uncategorized"),
  ];

  const tagNameList = TagCollection.find({ _id: { $in: transaction.tags } })
    .fetch()
    .map(({ name }) => name);

  // Map over the list of transactions and set the total of the transaction.
  // Transactions are stored in the database with the 'amount' set to the
  // sum of all the allocations. If this is a split transaction then only
  // a portion of the transaction total belongs to this ledger's transaction.
  // For example, say we have a single transaction that is split between the
  // ledgers "fast food" and "groceries" totalling $100. $45 allocated to
  // fast food, $55 allocated to groceries. If this ledger is the fast food
  // ledger then the transaction amount needs to be $45.
  const transactionAmount = ledgerId
    ? // Sum the allocations that belong to this LEDGER
      transaction.allocations.reduce((total, allocation) => {
        if (allocation.ledgerId != ledgerId) return total;
        return Math.round((total + allocation.amount) * 100) / 100;
      }, 0)
    : envelopeId
    ? // Sum the allocations that belong to this ENVELOPE
      transaction.allocations.reduce((total, allocation) => {
        if (allocation.envelopeId != envelopeId) return total;
        return Math.round((total + allocation.amount) * 100) / 100;
      }, 0)
    : transaction.amount;

  return {
    ...transaction,
    createdAt: new Date(transaction.createdAt),
    amount: transactionAmount,
    categoryAndLedgerNameList,
    categoryNameList,
    ledgerNameList,
    tagNameList,
  };
}
