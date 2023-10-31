import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "./LedgerCollection";
import { EnvelopeCollection } from "../Envelope/EnvelopCollection";

Meteor.methods({
  "ledger.createLedger"(input) {
    if (!this.userId) {
      return [];
    }

    try {
      // Get the budget that belongs to the user.
      const user = Meteor.user();
      const budgetId = user.budgetIdList[0];
      // Verify the envelope belongs to the current budget
      const envelopeBelongsToBudget = EnvelopeCollection.find({
        _id: input.envelopeId,
        budgetId,
      }).count();

      if (envelopeBelongsToBudget) {
        // Assign the budgetId to the ledger input
        input.budgetId = budgetId;
        // Validate and create the new ledger
        LedgerCollection.simpleSchema().clean(input, { mutate: true });
        LedgerCollection.simpleSchema().validate({
          ...input,
        });
        LedgerCollection.insert(input);
      }
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
