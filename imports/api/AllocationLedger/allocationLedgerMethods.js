import { Meteor } from "meteor/meteor";

// Collections
import { AllocationLedgerCollection } from "./AllocationLedgerCollection";
import { EnvelopeCollection } from "../Envelope/EnvelopeCollection";

Meteor.methods({
  // allocatedLedgerParams: The formData that contains all the needed properties
  // to create the allocation ledger.
  "allocationLedger.createLedger"(allocationLedgerParams) {
    if (!this.userId || !Meteor.user()) return;

    const user = Meteor.user();
    const { budgetId } = EnvelopeCollection.findOne({
      _id: allocationLedgerParams.envelopeId,
    });

    const newLedger = {
      accountId: user.accountId,
      budgetId,
      ...allocationLedgerParams,
    };

    AllocationLedgerCollection.insert(newLedger, (err, docId) => {
      if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
        // This is not a validation error. Console.log the error.
        console.log(err);
      }
    });

    // console.log(
    //   AllocationLedgerCollection.simpleSchema().clean({
    //     accountId: user.accountId,
    //     budgetId,
    //     ...allocationLedgerParams,
    //   })
    // );

    // console.log(
    //   AllocationLedgerCollection.simpleSchema()
    //     .namedContext()
    //     .validate(
    //       AllocationLedgerCollection.simpleSchema().clean({
    //         accountId: user.accountId,
    //         budgetId,
    //         ...allocationLedgerParams,
    //       })
    //     )
    // );
    return true;
    // Validate the params.

    // Create the allocation.

    // Return true on success.

    // Throw error on failure.
  },
});
