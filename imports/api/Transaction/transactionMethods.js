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
    if (!this.userId) return;
    TransactionCollection.remove({ _id: transactionId }, (err) => {
      if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
        // This is not a validation error. Console.log the error.
        console.log(err);
      }
    });
  },
});

function createAndAssignTags(transaction) {
  if (transaction.newTags) {
    // input.newTags is an array of strings (tag-names) which are names
    // for tags that need to be created and associated with this transaction.

    transaction.tags = [
      ...new Set([
        // keep any tags that previously exist / the user has selected.
        ...transaction.tags,
        // create new tags and associate them with this transaction.
        ...createTags({ tagNameList: transaction.newTags }),
      ]),
    ];
    // Remove field - No longer needed. I could let the validate function
    // remove but, but this is more explicit.
    delete transaction.newTags;
  }
}
