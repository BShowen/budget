import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "./LedgerCollection";
import { EnvelopeCollection } from "../Envelope/EnvelopeCollection";

Meteor.methods({
  "ledger.createLedger"(input) {
    if (!this.userId) {
      return [];
    }

    try {
      const accountId = Meteor.user().accountId;
      const { budgetId } = EnvelopeCollection.findOne(
        { _id: input.envelopeId },
        { fields: { budgetId: 1 } }
      );

      input = { ...input, accountId, budgetId };
      // Validate and create the new ledger
      LedgerCollection.simpleSchema().clean(input, { mutate: true });
      LedgerCollection.simpleSchema().validate({
        ...input,
      });

      LedgerCollection.insert(input);
    } catch (error) {
      console.log(error);
      if (error.error === "validation-error") {
        throw new Meteor.Error(
          "bad-user-input",
          error.details.map((err) => err.message)
        );
      } else {
        throw new Meteor.Error(error.message);
      }
    }
    return [];
  },
  "ledger.updateLedger"(input) {
    if (!this.userId) {
      return [];
    }

    LedgerCollection.countDocuments({
      _id: input._id,
      accountId: Meteor.user().accountId,
    }).then((count, error) => {
      if (count > 0) {
        const { _id: ledgerId } = input;
        const updatedLedgerFields = {
          name: input.name,
          startingBalance: input.startingBalance,
        };
        // Validate and update the updatedLedgerFields
        LedgerCollection.simpleSchema().clean(updatedLedgerFields, {
          mutate: true,
        });
        LedgerCollection.simpleSchema().validate(updatedLedgerFields, {
          keys: ["name", "startingBalance"],
        });
        LedgerCollection.update(
          { _id: ledgerId },
          { $set: updatedLedgerFields }
        );
      }

      if (error) {
        console.log(error);
      }
    });
  },
  "ledger.deleteLedger"({ ledgerId }) {
    if (!this.userId) {
      return [];
    }

    LedgerCollection.countDocuments({ _id: ledgerId }).then((count, error) => {
      if (count > 0) {
        LedgerCollection.remove({ _id: ledgerId });
      }

      if (error) {
        console.log(error);
      }
    });
  },
});
