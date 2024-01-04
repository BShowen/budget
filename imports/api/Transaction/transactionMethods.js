import { Meteor } from "meteor/meteor";
import { TransactionCollection } from "./TransactionCollection";
import { createTags } from "../Tag/tagMethods";

// Utils
import _pickBy from "lodash/pickBy.js";
import _isEqual from "lodash/isEqual.js";

Meteor.methods({
  "transaction.createTransaction"(transaction) {
    if (!this.userId) return;

    const user = Meteor.user();
    const newTransaction = {
      ...transaction,
      accountId: user.accountId,
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
    const oldTransaction = TransactionCollection.findOne({
      _id: transaction._id,
    });
    createAndAssignTags(transaction);
    const modifier = _pickBy(transaction, (value, key) => {
      // Create a new object of only the fields that have changed.
      // This will be used as the modifier to update the document.
      if (isObject(value)) {
        // If the value is an object then it is the loggedBy field which I don't
        //  want to update
        return false;
      }

      if (value instanceof Date) {
        return !_isEqual(oldTransaction[key], value);
      }

      if (value instanceof Array && key == "tags") {
        return true;
      }
      return oldTransaction[key] != value;
    });
    TransactionCollection.update(
      { _id: oldTransaction._id },
      {
        $set: { ...modifier },
      },
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
