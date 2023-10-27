import { Meteor } from "meteor/meteor";

// Collections
import { TransactionCollection } from "../TransactionCollection";
import { LedgerCollection } from "../../Ledger/LedgerCollection";

// Return all transactions associated with a budget
Meteor.publish("transactions", function () {
  if (!this.userId) {
    return [];
  }
  return TransactionCollection.find();
});
