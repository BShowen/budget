import { Meteor } from "meteor/meteor";

// Collections
import { TransactionCollection } from "../TransactionCollection";
import { LedgerCollection } from "../../Ledger/LedgerCollection";

// Return all transactions associated with a budget
Meteor.publish("transactions", function (budgetId) {
  if (!this.userId || !budgetId) {
    return this.ready();
  }
  const user = Meteor.user();
  return TransactionCollection.find({ accountId: user.accountId, budgetId });
});
