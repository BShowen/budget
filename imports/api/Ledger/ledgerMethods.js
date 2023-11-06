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

    // Verify the current user's account owns this envelope.
    const ledgerExists = LedgerCollection.find({
      _id: input._id,
      envelopeId: input.envelopeId,
      accountId: Meteor.user().accountId,
    }).count();

    if (ledgerExists) {
      const { _id: ledgerId } = input;
      const ledger = {
        name: input.name,
        startingBalance: input.startingBalance,
      };
      // Validate and update the ledger
      LedgerCollection.simpleSchema().clean(ledger, { mutate: true });
      LedgerCollection.simpleSchema().validate(ledger, {
        keys: ["name", "startingBalance"],
      });
      LedgerCollection.update({ _id: ledgerId }, { $set: ledger });
    }
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
