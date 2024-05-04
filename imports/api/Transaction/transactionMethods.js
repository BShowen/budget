import { Meteor } from "meteor/meteor";

// Collections
import { TransactionCollection } from "./TransactionCollection";

// Utils
import { createTags } from "../Tag/tagMethods";

// Methods
import { createTransaction } from "./createTransaction";

Meteor.methods({
  "transaction.updateTransaction"({
    transactionId,
    createdAt,
    budgetId,
    type,
    merchant,
    note,
    allocations,
    tags,
    newTags,
    amount,
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

    // Create any new tags.
    tags = newTags
      ? createTags({ selectedTagIdList: tags, newTagNameList: newTags })
      : tags;

    const isCategorized = allocations.every(
      ({ envelopeId, ledgerId }) =>
        envelopeId != "uncategorized" && ledgerId != "uncategorized"
    );

    const isSplitTransaction = allocations.length > 1;

    return TransactionCollection.update(
      { _id: transactionId },
      {
        $set: {
          createdAt: new Date(createdAt),
          type,
          merchant,
          note,
          allocations,
          tags,
          amount,
          isCategorized,
          isSplitTransaction,
        },
      }
    );
  },
  "transaction.deleteTransaction"({ transactionId }) {
    if (!this.userId || !transactionId) return;

    return TransactionCollection.remove({ _id: transactionId }, (error) => {
      if (error && Meteor.isServer) {
        console.log("---transaction.delete.Transaction---\n", error);
      }
    });
  },
});
