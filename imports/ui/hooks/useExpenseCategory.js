import { useTracker } from "meteor/react-meteor-data";

// Collections
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";

// Hooks
import { useTransactions } from "../hooks/useTransactions";

export function useExpenseCategory({ envelopeId, activeTab }) {
  const envelope = useTracker(() => {
    return EnvelopeCollection.findOne({ _id: envelopeId });
  });

  const ledgerList = useTracker(() => {
    return LedgerCollection.find({ envelopeId }).fetch();
  });

  const transactionList = useTransactions({ envelopeId });

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
