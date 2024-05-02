import { useTracker } from "meteor/react-meteor-data";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";

export function useTransaction({ transactionId }) {
  const transaction = useTracker(() => {
    return TransactionCollection.findOne({ _id: transactionId });
  });

  // This is an array of category documents
  const _envelopeList = useTracker(() => {
    const envelopeIdList = transaction.allocations.map(
      ({ envelopeId }) => envelopeId
    );
    return EnvelopeCollection.find(
      { _id: { $in: envelopeIdList } },
      { fields: { name: true, _id: true } }
    ).fetch();
  });

  // This is an array of ledger documents
  const _ledgerList = useTracker(() => {
    const ledgerIdList = transaction.allocations.map(
      ({ ledgerId }) => ledgerId
    );
    return LedgerCollection.find(
      { _id: { $in: ledgerIdList } },
      { fields: { name: true, _id: true, envelopeId: true } }
    ).fetch();
  });

  // This is an array of sub-arrays. Each sub array contains the category name
  // and the ledger name that this transaction belongs to.
  const categoryAndLedgerNameList = _envelopeList.reduce(
    (acc, { name: envelopeName, _id }) => {
      const { name: ledgerName } = _ledgerList.find(
        ({ envelopeId }) => envelopeId == _id
      );
      return [...acc, [envelopeName, ledgerName]];
    },
    [...(transaction.isCategorized ? [] : [["uncategorized"]])]
  );

  const _categoryNameList = _envelopeList.map(({ name }) => name);
  const categoryNameList = transaction.isCategorized
    ? _categoryNameList
    : [..._categoryNameList, "uncategorized"];

  const _ledgerNameList = _ledgerList.map(({ name }) => name);
  const ledgerNameList = transaction.isCategorized
    ? _ledgerNameList
    : [..._ledgerNameList, "uncategorized"];

  return {
    ...transaction,
    categoryAndLedgerNameList,
    categoryNameList,
    ledgerNameList,
  };
}
