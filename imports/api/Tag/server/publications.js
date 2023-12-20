import { Meteor } from "meteor/meteor";

// Collections
import { TagCollection } from "../TagCollection";

// Return all ledgers associated with a Budget
Meteor.publish("tags", function () {
  // Return all the tags associated with the current users account.
  if (!this.userId) {
    return this.ready();
  }
  const user = Meteor.user();
  return TagCollection.find({ accountId: user.accountId });
});
