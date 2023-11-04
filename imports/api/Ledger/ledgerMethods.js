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
});
