import { Meteor } from "meteor/meteor";
import { TransactionCollection } from "./TransactionCollection";
import { createTags } from "../Tag/tagMethods";

Meteor.methods({
  "transaction.createTransaction"(input) {
    if (!this.userId) {
      return [];
    }

    try {
      if (input.newTags) {
        // input.newTags is an array of strings (tag-names) which are names
        // for tags that need to be created and associated with this transaction.

        input.tags = [
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

      const user = Meteor.user();
      input = {
        ...input,
        accountId: user.accountId,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      };

      TransactionCollection.simpleSchema().clean(input, { mutate: true });
      TransactionCollection.simpleSchema().validate({
        ...input,
      });

      TransactionCollection.insert(input);
    } catch (error) {
      console.log(error);
      if (error.error === "validation-error") {
        throw new Meteor.Error(
          "bad-user-input",
          error.details.map((err) => err.message)
        );
      } else {
        throw new Meteor.Error(error.message);
      }
    }
    return [];
  },
});
