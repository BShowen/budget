import { reduceTransactions } from "./reduceTransactions";

// This function is used to obtain the total money spent and total money
// received in an envelope. It takes in an array of Ledgers (ledgerSchema objects)
// and reduces them into a single object accumulating the total money spent
// (expense) and total money received (income).

// Returns an object {income: Number, expense: Number}
export function reduceLedgers({ ledgers }) {
  return ledgers.reduce(
    (envelopeAcc, ledger) => {
      const { transactions } = ledger;
      const { income: ledgerIncomeTotal, expense: ledgerExpenseTotal } =
        reduceTransactions({ transactions });
      const { income: envelopeIncomeTotal, expense: envelopeExpenseTotal } =
        envelopeAcc;
      return {
        ...envelopeAcc,
        income: envelopeIncomeTotal + ledgerIncomeTotal,
        expense: envelopeExpenseTotal + ledgerExpenseTotal,
      };
    },
    { income: 0, expense: 0 }
  );
}
