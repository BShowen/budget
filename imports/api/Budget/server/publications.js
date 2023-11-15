import { Meteor } from "meteor/meteor";

// Collections
import { BudgetCollection } from "../BudgetCollection";
import { EnvelopeCollection } from "../../Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../Ledger/LedgerCollection";

Meteor.publish("budget", function (date) {
  // Return the budget specified by the date
  if (!this.userId || !date) {
    return null;
  }
  // get the user.budgetIdList
  const user = Meteor.user();
  // Create the budget if it doesn't exist.
  BudgetCollection.countDocuments({
    accountId: user.accountId,
    createdAt: date,
  }).then((count) => {
    if (count == 0) {
      // if date is after current date, create new budget with last month blueprint.
      // else create new budget with no blueprint
      const currentDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const queryDate = date;
      if (queryDate > currentDate) {
        // Create new budget with last month's blueprint
        // Get last months's budget
        const prevBudget = BudgetCollection.findOne({
          createdAt: new Date(
            queryDate.getFullYear(),
            queryDate.getMonth() - 1,
            1
          ),
          accountId: user.accountId,
        });
        // Get last months's envelopes
        const prevEnvelopes = EnvelopeCollection.find({
          accountId: user.accountId,
          budgetId: prevBudget._id,
        }).fetch();
        // Get last month's ledgers
        const prevLedgers = LedgerCollection.find({
          accountId: user.accountId,
          budgetId: prevBudget._id,
        }).fetch();
        // Create the budget.
        const newBudgetId = BudgetCollection.insert({
          accountId: user.accountId,
          createdAt: date,
        });
        // Iterate through each previous-envelope...
        prevEnvelopes.forEach((envelope) => {
          // Get the previous-ledgers for this envelope.
          const ledgers = prevLedgers.filter(
            (ledger) => ledger.envelopeId == envelope._id
          );
          // Create the new envelope
          const newEnvelope = {
            ...envelope,
            budgetId: newBudgetId,
          };
          // Remove the old _id from the envelope.
          delete newEnvelope._id;
          // Insert the new envelope
          const newEnvelopeId = EnvelopeCollection.insert(newEnvelope);

          // iterate through each ledger and insert the ledger with the new envelope's _id
          ledgers.forEach((ledger) => {
            // Create the new ledger
            const newLedger = {
              ...ledger,
              budgetId: newBudgetId,
              envelopeId: newEnvelopeId,
            };
            // Remove the old _id from the ledger
            delete newLedger._id;
            // Insert the new ledger
            LedgerCollection.insert(newLedger);
          });
        });
      } else {
        // Create the budget.
        const budgetId = BudgetCollection.insert({
          accountId: user.accountId,
          createdAt: date,
        });
        // Create income Envelope
        EnvelopeCollection.insert({
          budgetId,
          accountId: user.accountId,
          isIncomeEnvelope: true,
          isSavingsEnvelope: false,
          name: "income",
        });
        // Create savings Envelope
        EnvelopeCollection.insert({
          budgetId,
          accountId: user.accountId,
          isIncomeEnvelope: false,
          isSavingsEnvelope: true,
          name: "savings",
        });
      }
    }
  });

  return BudgetCollection.find({
    accountId: user.accountId,
    createdAt: date,
  });
});
