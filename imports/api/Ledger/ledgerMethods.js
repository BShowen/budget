import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "./LedgerCollection";
import { EnvelopeCollection } from "../Envelope/EnvelopeCollection";

Meteor.methods({
  "ledger.createLedger"(input) {
    if (!this.userId) return;

    const accountId = Meteor.user().accountId;
    const { budgetId, isIncomeEnvelope, isSavingsEnvelope } =
      EnvelopeCollection.findOne({ _id: input.envelopeId });

    input = {
      ...input,
      accountId,
      budgetId,
      isIncomeLedger: isIncomeEnvelope,
      isSavingsLedger: isSavingsEnvelope,
    };

    LedgerCollection.insert(input, (err) => {
      if (err && Meteor.isServer) {
        console.log(err);
      }
    });
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
          startingBalance: input.startingBalance,
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
});
