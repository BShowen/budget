import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "../LedgerCollection";

// Return all ledgers associated with a Budget
Meteor.publish("ledgers", function (budgetId) {
  if (!this.userId || !budgetId) {
    return this.ready();
  }
  const user = Meteor.user();
  return LedgerCollection.find({ accountId: user.accountId, budgetId });
});
