import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";

const userSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: String,
  password: {
    type: String,
    optional: true,
  },
});

// Meteor.users.attachSchema(userSchema);

export { userSchema as UserCollection };
