import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";

// Collections
import { TransactionCollection } from "./TransactionCollection";
import { LedgerCollection } from "../Ledger/LedgerCollection";

// Utils
import { createTags } from "../Tag/tagMethods";

// Methods
import { createTransaction } from "./createTransaction";

Meteor.methods({
  "transaction.updateTransaction"({
    transactionIdList,
    createdAt,
    budgetId,
    type,
    amount,
    merchant,
    note,
    allocations,
    tags,
    newTags,
  }) {
    if (!this.userId) return;
    // Validate the incoming transaction args.
    // I am re-using the createTransaction.validate method because the logic is
    // exactly the same. I have to call the validate method with "this" because
    // the validate methods expected the user to be logged in by checking
    // this.userId()
    createTransaction.validate.call(this, {
      createdAt,
      budgetId,
      type,
      merchant,
      note,
      allocations,
      amount,
    });
    transactionIdList.forEach((id) => {
      TransactionCollection.remove({ _id: id });
    });
    return createTransaction.run.call(this, {
      createdAt,
      budgetId,
      type,
      amount,
      merchant,
      note,
      allocations,
      tags,
      newTags,
    });
  },
  "transaction.deleteTransaction"({ transactionId }) {
    if (!this.userId || !transactionId) return;

    TransactionCollection.remove(
      {
        $or: [{ _id: transactionId }, { splitTransactionId: transactionId }],
      },
      (error) => {
        if (error && Meteor.isServer) {
          console.log("---transaction.delete.Transaction---\n", error);
        }
      }
    );
  },
});
