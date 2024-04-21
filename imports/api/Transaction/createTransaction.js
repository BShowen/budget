import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { ValidationError } from "meteor/mdg:validation-error";

// Collections
import { TransactionCollection } from "./TransactionCollection";
import { LedgerCollection } from "../Ledger/LedgerCollection";

// Schema
import { transactionSchema } from "./transactionSchema";

// Model methods
import { createTags } from "../Tag/tagMethods";

export const createTransaction = new ValidatedMethod({
  name: "transaction.createTransaction",
  validate: function ({
    createdAt,
    budgetId,
    type,
    merchant,
    note,
    allocations,
    amount,
  }) {
    if (!this.userId) {
      throw new Meteor.Error(
        "transaction.createTransaction",
        "Not logged in",
        "You must be logged in to create a transaction"
      );
    }
    const user = Meteor.user();
    // Create the transaction object.
    const transaction = {
      amount,
      createdAt,
      budgetId,
      type,
      merchant,
      note,
      allocations,
      isSplitTransaction: allocations.length > 1,
      accountId: user.accountId,
      loggedBy: {
        userId: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
      },
    };

    // Validate the transaction object
    const validationContext = transactionSchema.newContext();
    validationContext.clean(transaction);
    validationContext.validate(transaction);
    if (validationContext.validationErrors().length > 0) {
      throw new ValidationError(validationContext.validationErrors());
    }
  },
  run({
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
    const user = Meteor.user();

    // Create and insert new tags, if any.
    // tags is an array of tag Ids (Mongo Ids).
    tags = newTags
      ? createTags({ selectedTagIdList: tags, newTagNameList: newTags })
      : tags;

    TransactionCollection.insert(
      {
        amount: amount,
        accountId: user.accountId,
        createdAt: new Date(createdAt.replace(/-/g, "/")),
        // The date string is received as 'YYYY-MM-DD' from the client.
        // I convert it to 'YYYY/MM/DD'. If you create a date like:
        // new Date('2024-04-01') and call toLocaleString() it will
        // return 03/31/2024 because of timezone reasons. If you use
        // the same date like this: new Date('2024/04/01') and call
        // toLocaleString() it will return what you expect: 04/01/2024.
        // This is the easiest way for me to fix this right now without
        // handling timezones or using a date/ time library.
        budgetId,
        type,
        merchant,
        note,
        tags,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
        isSplitTransaction: allocations.length > 1,
        allocations,
      },
      (error) => {
        if (error) console.log(error);
      }
    );
  },
});
