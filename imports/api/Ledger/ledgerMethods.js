import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "./LedgerCollection";
import { EnvelopeCollection } from "../Envelope/EnvelopeCollection";

Meteor.methods({
  "ledger.createLedger"(input) {
    if (!this.userId) return;

    const accountId = Meteor.user().accountId;
    const { budgetId, kind } = EnvelopeCollection.findOne({
      _id: input.envelopeId,
    });

    LedgerCollection.insert(
      {
        ...input,
        accountId,
        budgetId,
        kind,
      },
      (err) => {
        if (err && Meteor.isServer) {
          console.log(err);
        }
      }
    );
  },
  "ledger.updateLedger"(input) {
    if (!this.userId) return;

    LedgerCollection.countDocuments({
      _id: input._id,
      accountId: Meteor.user().accountId,
    }).then((count, countError) => {
      if (count > 0) {
        const { _id: ledgerId } = input;
        const updatedLedgerFields = {
          name: input.name,
          allocatedAmount: input.allocatedAmount,
        };
        LedgerCollection.update(
          { _id: ledgerId },
          { $set: updatedLedgerFields },
          (err) => {
            if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
              // This is not a validation error. Console.log the error.
              console.log(err);
            }
          }
        );
      }

      if (countError && Meteor.isServer) {
        console.log(countError);
      }
    });
  },
  "ledger.deleteLedger"({ ledgerId }) {
    if (!this.userId) return;

    LedgerCollection.countDocuments({ _id: ledgerId }).then(
      (count, countError) => {
        if (count > 0) {
          LedgerCollection.remove({ _id: ledgerId }, (err) => {
            if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
              // This is not a validation error. Console.log the error.
              console.log(err);
            }
          });
        }

        if (countError && Meteor.isServer) {
          console.log(countError);
        }
      }
    );
  },
  "ledger.createAllocationLedger"({ name, goalAmount, endDate, budgetId }) {
    if (!this.userId) return;

    const accountId = Meteor.user().accountId;
    const savingsEnvelope = EnvelopeCollection.findOne(
      {
        accountId,
        budgetId,
        kind: "savings",
      },
      { field: { _id: true } }
    );
    return LedgerCollection.insert(
      {
        accountId,
        budgetId,
        envelopeId: savingsEnvelope._id,
        name,
        kind: "allocation",
        allocation: {
          goalAmount,
          endDate,
        },
      },
      (error, documentId) => {
        if (error && Meteor.isServer) {
          console.log(
            "ledger.createAllocationLeger error on date: ",
            new Date().toString(),
            error
          );
        } else {
          return documentId;
        }
      }
    );
  },
});
