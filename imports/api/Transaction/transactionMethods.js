import { Meteor } from "meteor/meteor";
import { TransactionCollection } from "./TransactionCollection";

Meteor.methods({
  "transaction.createTransaction"(input) {
    if (!this.userId) {
      return [];
    }
    // Extract the tagIds.
    try {
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
