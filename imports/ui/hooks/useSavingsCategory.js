import { useTracker } from "meteor/react-meteor-data";

// Collections
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";

// Hooks
import { useTransactions } from "../hooks/useTransactions";
export function useSavingsCategory({ envelopeId, activeTab }) {
  const envelope = useTracker(() => {
    return EnvelopeCollection.findOne({ _id: envelopeId });
  });

  const ledgerList = useTracker(() => {
    return LedgerCollection.find({ envelopeId }).fetch();
  });

  const transactionList = useTransactions({ envelopeId });

  const moneySaved = transactionList
    .filter(({ type }) => type == "income")
    .reduce((total, { amount }) => Math.round((amount + total) * 100) / 100, 0);

  const moneySpent = transactionList
    .filter(({ type }) => type == "expense")
    .reduce((total, { amount }) => Math.round((amount + total) * 100) / 100, 0);

  const moneyExpectedToSave = ledgerList.reduce(
    (total, { allocatedAmount }) =>
      Math.round((allocatedAmount + total) * 100) / 100,
    0
  );

  const moneyLeftToSave = Math.max(
    Math.round((moneyExpectedToSave - moneySaved) * 100) / 100,
    0
  );

  const percentLeftToSave = Math.round(
    (moneyLeftToSave / moneyExpectedToSave) * 100
  );

  const displayBalance = activeTab
    ? activeTab === "spent"
      ? moneySpent
      : activeTab === "remaining"
      ? moneyLeftToSave
      : moneyExpectedToSave
    : 0;

  return {
    ...envelope,
    transactionList,
    ledgerList,
    moneyExpectedToSave,
    moneySaved,
    moneySpent,
    moneyLeftToSave,
    percentLeftToSave,
    activeTab,
    displayBalance,
  };
}
