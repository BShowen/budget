import { Meteor } from "meteor/meteor";
import { EnvelopeCollection } from "./EnvelopeCollection";

Meteor.methods({
  "envelope.createEnvelope"({ budgetId }) {
    if (!this.userId || !Meteor.user()) return;

    EnvelopeCollection.insert(
      {
        accountId: Meteor.user().accountId,
        budgetId,
      },
      (err) => {
        if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
          // This is not a validation error. Console.log the error.
          console.log(err);
        }
      }
    );
  },
  "envelope.updateEnvelope"({ name, envelopeId }) {
    if (!this.userId || !Meteor.user()) return;

    const modifier = { $set: { name } };

    EnvelopeCollection.update(
      { _id: envelopeId, accountId: Meteor.user().accountId },
      modifier,
      (err) => {
        if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
          // This is not a validation error. Console.log the error.
          console.log(err);
        }
      }
    );
  },
  "envelope.deleteEnvelope"({ envelopeId }) {
    if (!this.userId || !Meteor.user()) return;

    EnvelopeCollection.remove(
      {
        _id: envelopeId,
        accountId: Meteor.user().accountId,
      },
      (err) => {
        if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
          // This is not a validation error. Console.log the error.
          console.log(err);
        }
      }
    );
  },
});
