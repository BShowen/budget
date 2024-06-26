import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { ValidationError } from "meteor/mdg:validation-error";

// Collections
import { TransactionCollection } from "./TransactionCollection";

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

    const isCategorized = allocations.every(
      ({ envelopeId, ledgerId }) =>
        envelopeId != "uncategorized" && ledgerId != "uncategorized"
    );
    TransactionCollection.insert(
      {
        amount: amount,
        accountId: user.accountId,
        createdAt: createdAt,
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
        isCategorized,
      },
      (error) => {
        if (error) console.log(error);
      }
    );
  },
});
