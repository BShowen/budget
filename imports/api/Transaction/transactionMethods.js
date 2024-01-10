import { Meteor } from "meteor/meteor";
import { TransactionCollection } from "./TransactionCollection";
import { createTags } from "../Tag/tagMethods";

// Utils
import { LedgerCollection } from "../Ledger/LedgerCollection";

Meteor.methods({
  "transaction.createTransaction"(transaction) {
    if (!this.userId) return;

    const { envelopeId } =
      LedgerCollection.findOne({
        _id: transaction.ledgerId,
      }) || {};

    const user = Meteor.user();
    const newTransaction = {
      ...transaction,
      accountId: user.accountId,
      envelopeId,
      loggedBy: {
        userId: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
      },
    };

    if (newTransaction.newTags) {
      // input.newTags is an array of strings (tag-names) which are names
      // for tags that need to be created and associated with this transaction.

      newTransaction.tags = [
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

    TransactionCollection.insert(newTransaction, (err) => {
      if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
        // This is not a validation error. Console.log the error.
        console.log(err);
      }
    });
  },
  "transaction.updateTransaction"(transaction) {
    if (!this.userId) return;
    createAndAssignTags(transaction);

    // Assigned the transaction to the envelope that the ledger belongs to.
    const { envelopeId } =
      LedgerCollection.findOne({
        _id: transaction.ledgerId,
      }) || {};
    transaction.envelopeId = envelopeId;

    const { ledgerId, _id: transactionId } = transaction;

    const unsetModifier =
      ledgerId === "uncategorized" ? { ledgerId: "", envelopeId: "" } : {};

    if ("note" in transaction && transaction.note.trim().length == 0) {
      unsetModifier.note = "";
    }

    TransactionCollection.simpleSchema().clean(transaction);

    TransactionCollection.update(
      { _id: transactionId },
      { $set: { ...transaction }, $unset: { ...unsetModifier } },
      (err) => {
        if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
          // This is not a validation error. Console.log the error.
          console.log(err);
        }
      }
    );
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

function isObject(value) {
  return (
    value instanceof Object &&
    !(value instanceof Array) &&
    !(value instanceof Date)
  );
}

const t = {
  set: {},
  unset: {},
};
