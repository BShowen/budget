import { Meteor } from "meteor/meteor";

// Collections
import { PaycheckCollection } from "../PaycheckCollection";

// Return all ledgers associated with a Budget
Meteor.publish("paychecks", function () {
  if (!this.userId) {
    return [];
  }
  return PaycheckCollection.find();
});
