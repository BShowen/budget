import { Meteor } from "meteor/meteor";

// Return all users associated with the currently logged in account
Meteor.publish("allUsers", function () {
  if (!this.userId) {
    return this.ready();
  }
  const user = Meteor.user();
  return Meteor.users.find(
    { accountId: user.accountId },
    { fields: { services: 0, createdAt: 0, accountId: 0 } }
  );
});
