import { Meteor } from "meteor/meteor";
import { TagCollection } from "./TagCollection";

Meteor.methods({
  "tag.createTag"(input) {
    if (!this.userId) {
      return [];
    }

    try {
      const user = Meteor.user();

      input.accountId = user.accountId;

      TagCollection.simpleSchema().clean(input, { mutate: true });
      TagCollection.simpleSchema().validate({
        ...input,
      });

      TagCollection.insert(input);
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
