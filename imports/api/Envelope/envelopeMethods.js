import { Meteor } from "meteor/meteor";
import { EnvelopeCollection } from "./EnvelopeCollection";

Meteor.methods({
  "envelope.createEnvelope"({ budgetId }) {
    if (!this.userId || !Meteor.user()) return;

    EnvelopeCollection.insert(
      {
        accountId: Meteor.user().accountId,
        budgetId,
        kind: "expense", // Currently users can only create expense envelopes
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

    EnvelopeCollection.update(
      {
        _id: envelopeId,
        accountId: Meteor.user().accountId,
        kind: "expense", // Only expense envelopes can be updated.
      },
      { $set: { name } },
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
        // Only expense and allocation envelopes can be deleted.
        $or: [{ kind: "expense" }, { kind: "allocation" }],
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
