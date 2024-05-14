import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Helpers
import { populateTransaction } from "./helpers/populateTransaction";

export function useTransaction({ transactionId }) {
  const navigate = useNavigate();
  const transaction = useTracker(() => {
    return TransactionCollection.findOne({ _id: transactionId });
  });

  // This will trigger if a user is viewing this transaction's details and
  // the transaction gets deleted by another user.
  if (!transaction) navigate(-1);

  return populateTransaction({ transaction });
}
