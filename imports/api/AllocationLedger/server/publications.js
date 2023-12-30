import { Meteor } from "meteor/meteor";

// Collections
import { AllocationLedgerCollection } from "../AllocationLedgerCollection";

Meteor.publish("allocationLedgers", function (budgetId) {
  if (!this.userId || !budgetId) {
    return this.ready();
  }
  const user = Meteor.user();
  return AllocationLedgerCollection.find({
    accountId: user.accountId,
    budgetId,
  });
});
