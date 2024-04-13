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
    selectedLedgerList,
  }) {
    if (!this.userId) {
      throw new Meteor.Error(
        "transaction.createTransaction",
        "Not logged in",
        "You must be logged in to create a transaction"
      );
    }
    const user = Meteor.user();
    const isSplitTransaction = selectedLedgerList.length > 1;
    const splitTransactionId = isSplitTransaction
      ? getUniqueMongoId({ collection: TransactionCollection })
      : undefined;

    const invalidFieldList = [
      // ...new Set removes duplicate invalid fields.
      ...new Set(
        selectedLedgerList.flatMap((ledger) => {
          // ledger = {_id: String , amount: String}
          // Create the transaction object.
          const transaction = {
            ...ledger,
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
              : { isSplitTransaction }),
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
      ...(selectedLedgerList.length == 0 ? ["Ledger is required"] : []),
    ].reduce(
      (acc, fieldName) => [...acc, { name: fieldName, type: "required" }],
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
    merchant,
    note,
    selectedLedgerList,
    tags,
    newTags,
  }) {
    const user = Meteor.user();

    const isSplitTransaction = selectedLedgerList.length > 1;
    const splitTransactionId = isSplitTransaction
      ? getUniqueMongoId({ collection: TransactionCollection })
      : undefined;

    // Create and insert new tags, if any.
    // tags is an array of tag Ids (Mongo Ids).
    tags = newTags
      ? createTags({ selectedTagIdList: tags, newTagNameList: newTags })
      : tags;

    selectedLedgerList.forEach((ledger) => {
      // Get envelopeId that this ledger belongs to.
      // Will be undefined for uncategorized transactions.
      // Will be defined if user selected a ledger.
      const { envelopeId, _id: ledgerId } =
        ledger._id == "uncategorized" || ledger._id === undefined
          ? { envelopeId: undefined, _id: undefined }
          : LedgerCollection.findOne(
              { _id: ledger._id },
              { fields: { _id: true, envelopeId: true } }
            );

      TransactionCollection.insert(
        {
          amount: ledger.amount,
          accountId: user.accountId,
          envelopeId,
          ledgerId,
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
            : { isSplitTransaction }),
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
