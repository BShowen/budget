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
  "envelope.updateEnvelope"({ name, envelopeId }) {
    if (!this.userId || !Meteor.user()) {
      return;
    }

    try {
      EnvelopeCollection.update(
        { _id: envelopeId, accountId: Meteor.user().accountId },
        { $set: { name } }
      );
    } catch (error) {
      console.log(error);
    }
  },
  "envelope.deleteEnvelope"({ envelopeId }) {
    if (!this.userId || !Meteor.user()) {
      return;
    }

    try {
      EnvelopeCollection.remove({
        _id: envelopeId,
        accountId: Meteor.user().accountId,
      });
    } catch (error) {
      console.log(error);
    }
  },
});
