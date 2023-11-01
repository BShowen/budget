import { Meteor } from "meteor/meteor";

// Collections
import { PaycheckCollection } from "../PaycheckCollection";

// Return all ledgers associated with a Budget
Meteor.publish("paychecks", function (budgetId) {
  if (!this.userId || !budgetId) {
    return [];
  }
  const user = Meteor.user();
  return PaycheckCollection.find({ accountId: user.accountId, budgetId });
});
