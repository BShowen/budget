import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "../LedgerCollection";
import { TransactionCollection } from "../../Transaction/TransactionCollection";

// Return all ledgers associated with a Budget
Meteor.publish("ledgers", function () {
  if (!this.userId) {
    return [];
  }
  return LedgerCollection.find();
});
