// This function takes in an array of Transactions (transactionSchema objects)
// and reduces them into a single object accumulating the total money spent
// (expense) and total money received (income).

// Returns an object {income: Number, expense: Number}
export function reduceTransactions({ transactions }) {
  if (!Array.isArray(transactions)) {
    throw new Error(
      `reduceTransactions param of type ${typeof transactions} must be an array.`
    );
  }

  return transactions.reduce(
    (ledgerTotals, transaction) => {
      const transType = transaction.type;
      return {
        ...ledgerTotals,
        [transType]:
          Math.round((ledgerTotals[transType] + transaction.amount) * 100) /
          100,
      };
    },
    { income: 0, expense: 0 }
  );
}
