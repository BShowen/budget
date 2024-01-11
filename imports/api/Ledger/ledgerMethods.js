import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "./LedgerCollection";
import { EnvelopeCollection } from "../Envelope/EnvelopeCollection";
import { TransactionCollection } from "../Transaction/TransactionCollection";

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
    TransactionCollection.remove({ ledgerId }, (transactionError) => {
      if (transactionError) {
        // Console log the error on the server.
        Meteor.isServer &&
          console.log(
            "ledger.deleteLedger\nError deleting transactions",
            transactionError
          );
        throw new Meteor.Error(
          "ledger.deleteLedger",
          "Error deleting transactions associated with ledger. "
        );
      } else {
        LedgerCollection.remove({ _id: ledgerId }, (ledgerError) => {
          if (ledgerError) {
            // Console log the error on the server.
            Meteor.isServer &&
              console.log(
                "ledger.deleteLedger\nError deleting ledger",
                ledgerError
              );
            throw new Meteor.Error(
              "ledger.deleteLedger",
              "Error deleting ledger."
            );
          }
        });
      }
    });
  },
  "ledger.createAllocationLedger"({
    name,
    goalAmount,
    startingBalance,
    endDate,
    budgetId,
  }) {
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
          runningTotal: startingBalance || 0,
        },
        startingBalance: startingBalance || 0,
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
