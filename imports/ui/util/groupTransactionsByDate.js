// Returns an array of objects. Each object is a group of transactions.
// Each object has the key "date", and "transactions"
// date is the date of the transactions.
// transactions is an array of transactions that have the same date as the date key
export function groupTransactionsByDate({ transactions }) {
  const groupedTransactions = groupTransactions({ transactions });
  const trans = [];
  for (const [date, transactions] of Object.entries(groupedTransactions)) {
    // add the date element to the list
    trans.push({ date, transactions });
  }
  return trans;
}

// Returns an object of grouped transactions.
// The object has the date as the key and an array of transactions and the value
const groupTransactions = ({ transactions }) => {
  return transactions.reduce(
    (acc, transaction) => ({
      ...acc,
      [transaction.createdAt]: [
        ...(acc[transaction.createdAt] || []),
        transaction,
      ],
    }),
    {}
  );
};
