import { Meteor } from "meteor/meteor";

// Assign a user to an account
export function assignUserToAccount({ userId, accountId }) {
  Meteor.users.update({ _id: userId }, { $set: { accountId } });
}
