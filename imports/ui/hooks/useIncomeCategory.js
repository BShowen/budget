import { useTracker } from "meteor/react-meteor-data";

// Collections
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";

// Hooks
import { useTransactions } from "../hooks/useTransactions";

export function useIncomeCategory({ envelopeId, activeTab }) {
  const envelope = useTracker(() => {
    return EnvelopeCollection.findOne({ _id: envelopeId });
  });

  const ledgerList = useTracker(() => {
    return LedgerCollection.find({ envelopeId }).fetch();
  });

  const transactionList = useTransactions({ envelopeId });

  const incomeReceived = transactionList
    .filter(({ type }) => type == "income")
    .reduce((total, { amount }) => Math.round((amount + total) * 100) / 100, 0);

  const incomeExpected = ledgerList.reduce((total, ledger) => {
    return Math.round((ledger.allocatedAmount + total) * 100) / 100;
  }, 0);

  const incomeLeftToReceive =
    Math.round((incomeExpected - incomeReceived) * 100) / 100;

  const percentLeftToReceive = Math.round(
    (incomeLeftToReceive / incomeExpected) * 100
  );

  const displayBalance = activeTab
    ? activeTab === "spent"
      ? incomeReceived
      : activeTab === "remaining"
      ? incomeLeftToReceive
      : incomeExpected
    : 0;

  return {
    ...envelope,
    transactionList,
    ledgerList,
    incomeReceived,
    incomeExpected,
    incomeLeftToReceive,
    percentLeftToReceive,
    displayBalance,
  };
}
