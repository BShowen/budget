import { Meteor } from "meteor/meteor";
import { EnvelopeCollection } from "./EnvelopeCollection";
import { TransactionCollection } from "../Transaction/TransactionCollection";
import { LedgerCollection } from "../Ledger/LedgerCollection";

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
    const accountId = Meteor.user().accountId;
    // Delete all the transactions associated with this envelope.
    TransactionCollection.remove(
      { envelopeId, accountId },
      (transactionError) => {
        if (transactionError) {
          Meteor.isServer &&
            console.log(
              "envelope.deleteEnvelope\nError deleting transactions associated with envelope."
            );
          throw new Meteor.Error(
            "envelope.deleteEnvelope",
            "Error deleting transactions associated with envelope."
          );
        } else {
          // Delete all the ledgers associated with this envelope.
          LedgerCollection.remove({ envelopeId, accountId }, (ledgerError) => {
            if (ledgerError) {
              Meteor.isServer &&
                console.log(
                  "envelope.deleteEnvelope\nError deleting ledgers associated with envelope."
                );
            } else {
              // Delete this envelope
              EnvelopeCollection.remove(
                {
                  _id: envelopeId,
                  accountId: Meteor.user().accountId,
                  // Only expense and allocation envelopes can be deleted.
                  $or: [{ kind: "expense" }, { kind: "allocation" }],
                },
                (envelopeError) => {
                  if (envelopeError) {
                    Meteor.isServer &&
                      console.log(
                        "envelope.deleteEnvelope\nError deleting envelope."
                      );
                  }
                }
              );
            }
          });
        }
      }
    );
  },
});
