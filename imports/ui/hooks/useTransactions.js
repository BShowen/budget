import { useTracker } from "meteor/react-meteor-data";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Helpers
import { populateTransaction } from "./helpers/populateTransaction";

// A hook that returns an array of transactions with some populated information
// for each transaction.
// Only one of the arguments is required.
// ledgerId: If ledgerId is provided then a list of transactions for that ledger is returned.
// envelopeId: If envelopeId is provided then a list of transactions for that category is returned.
export function useTransactions({ ledgerId, envelopeId } = {}) {
  const transactionList = useTracker(() => {
    const transactions =
      ledgerId || envelopeId
        ? TransactionCollection.find(
            {
              $or: [
                { allocations: { $elemMatch: { ledgerId } } },
                { allocations: { $elemMatch: { envelopeId } } },
              ],
            },
            { sort: { createdAt: -1 } }
          ).fetch()
        : TransactionCollection.find({}, { sort: { createdAt: -1 } }).fetch();

    return transactions.map((transaction) =>
      populateTransaction({ ledgerId, envelopeId, transaction })
    );
  });

  return transactionList;
}
