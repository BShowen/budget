import { Meteor } from "meteor/meteor";

// Collections
import { EnvelopeCollection } from "../EnvelopCollection";

Meteor.publish("envelopes", function (budgetId) {
  if (!this.userId || !budgetId) {
    return [];
  }
  const user = Meteor.user();
  return EnvelopeCollection.find({ accountId: user.accountId, budgetId });
});
