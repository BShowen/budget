import { Meteor } from "meteor/meteor";

// Collections
import { EnvelopeCollection } from "../EnvelopCollection";

Meteor.publish("envelopes", function () {
  if (!this.userId) {
    return [];
  }

  // get the user.budgetIdList
  const user = Meteor.user();

  return EnvelopeCollection.find();
});
