// This function takes in an array of Transactions (transactionSchema objects)
// and reduces them into a single object accumulating the total money spent
// (expense) and total money received (income).

// Returns an object {income: Number, expense: Number}
export function reduceTransactions({ transactions }) {
  return transactions.reduce(
    (ledgerTotals, transaction) => {
      const transType = transaction.type;
      return {
        ...ledgerTotals,
        [transType]: ledgerTotals[transType] + transaction.amount,
      };
    },
    { income: 0, expense: 0 }
  );
}
