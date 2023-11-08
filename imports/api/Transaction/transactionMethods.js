import { Meteor } from "meteor/meteor";
import { TransactionCollection } from "./TransactionCollection";
import { createTags } from "../Tag/tagMethods";

Meteor.methods({
  "transaction.createTransaction"(input) {
    if (!this.userId) return;

    const user = Meteor.user();
    const newTransaction = {
      ...input,
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
          ...input.tags,
          // create new tags and associate them with this transaction.
          ...createTags({ tagNameList: input.newTags }),
        ]),
      ];
      // Remove field - No longer needed. I could let the validate function
      // remove but, but this is more explicit.
      delete input.newTags;
    }

    TransactionCollection.insert(newTransaction, (err) => {
      if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
        // This is not a validation error. Console.log the error.
        console.log(err);
      }
    });
  },
});
