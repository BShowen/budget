import { Meteor } from "meteor/meteor";
import { EnvelopeCollection } from "./EnvelopeCollection";

Meteor.methods({
  "envelope.createEnvelope"({ budgetId }) {
    if (!this.userId || !Meteor.user()) return;

    EnvelopeCollection.insert(
      {
        accountId: Meteor.user().accountId,
        budgetId,
        isIncomeEnvelope: false, // User's can never modify this field
        isSavingsEnvelope: false, // User's can never modify this field
        name: "untitled",
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
      {
        _id: envelopeId,
        accountId: Meteor.user().accountId,
        // If true that means it's an income envelope, which are NEVER to be updated.
        isIncomeEnvelope: false,
        // If true that means it's a savings envelope, which are NEVER to be updated.
        $or: [
          { isSavingsEnvelope: false },
          {
            // For backwards compatibility
            isSavingsEnvelope: {
              $exists: false,
            },
          },
        ],
      },
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
        // If true that means it's an income envelope, which are NEVER to be deleted.
        isIncomeEnvelope: false,
        // If true that means it's a savings envelope, which are NEVER to be deleted.
        isSavingsEnvelope: false,
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
