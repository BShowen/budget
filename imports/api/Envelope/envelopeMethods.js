import { Meteor } from "meteor/meteor";
import { EnvelopeCollection } from "./EnvelopeCollection";

Meteor.methods({
  "envelope.createEnvelope"({ budgetId }) {
    if (!this.userId || !Meteor.user()) {
      return;
    }

    try {
      EnvelopeCollection.insert({
        accountId: Meteor.user().accountId,
        budgetId,
      });
    } catch (error) {
      console.log(error);
    }
  },
});
