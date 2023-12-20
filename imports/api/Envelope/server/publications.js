import { Meteor } from "meteor/meteor";

// Collections
import { EnvelopeCollection } from "../EnvelopeCollection";

Meteor.publish("envelopes", function (budgetId) {
  if (!this.userId || !budgetId) {
    return this.ready();
  }
  const user = Meteor.user();
  return EnvelopeCollection.find({ accountId: user.accountId, budgetId });
});
