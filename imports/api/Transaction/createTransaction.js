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

// Utils
import { getUniqueMongoId } from "../../ui/util/getUniqueMongoId";

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
    const isSplitTransaction = allocations.length > 1;
    const splitTransactionId = isSplitTransaction
      ? getUniqueMongoId({ collection: TransactionCollection })
      : undefined;

    // This allows creating un-categorized transactions
    if (allocations.length == 0) {
      allocations.push({ amount });
    }
    const invalidFieldList = [
      // ...new Set removes duplicate invalid fields.
      ...new Set(
        allocations.flatMap((allocation) => {
          // Create the transaction object.
          const transaction = {
            ...allocation,
            accountId: user.accountId,
            createdAt,
            budgetId,
            type,
            merchant,
            note,
            loggedBy: {
              userId: user._id,
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
            },
            // Conditionally add splitTransactionId
            // If isSplitTransaction then add splitTransactionId
            ...(isSplitTransaction
              ? { isSplitTransaction, splitTransactionId }
              : { isSplitTransaction, amount }),
          };
          // Validate the transaction object
          const validationContext = transactionSchema.newContext();
          validationContext.clean(transaction);
          validationContext.validate(transaction);
          // Return just the invalid field names.
          return validationContext
            .validationErrors()
            .map((error) => error.name);
        })
      ),
    ].reduce(
      (arr, fieldName) => [...arr, { name: fieldName, type: "required" }],
      []
    );
    if (invalidFieldList.length > 0) {
      throw new ValidationError(invalidFieldList);
    }
  },
  run({
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
    const user = Meteor.user();

    const isSplitTransaction = allocations.length > 1;
    const splitTransactionId = isSplitTransaction
      ? getUniqueMongoId({ collection: TransactionCollection })
      : undefined;

    // This allows creating un-categorized transactions
    if (allocations.length == 0) {
      allocations.push({ amount });
    }

    // Create and insert new tags, if any.
    // tags is an array of tag Ids (Mongo Ids).
    tags = newTags
      ? createTags({ selectedTagIdList: tags, newTagNameList: newTags })
      : tags;

    allocations.forEach((allocation) => {
      // Get the envelope this transaction will belong to.
      const { envelopeId } =
        LedgerCollection.findOne({ _id: allocation?.ledgerId }) || {};
      TransactionCollection.insert(
        {
          ...allocation,
          accountId: user.accountId,
          envelopeId,
          createdAt,
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
          // Conditionally add splitTransactionId
          // If isSplitTransaction then add splitTransactionId
          ...(isSplitTransaction
            ? { isSplitTransaction, splitTransactionId }
            : { isSplitTransaction, amount }),
        },
        (error) => {
          if (error) console.log(error);
          if (error && isSplitTransaction && splitTransactionId) {
            TransactionCollection.remove({ splitTransactionId });
          }
        }
      );
    });
  },
});
