import { Meteor } from "meteor/meteor";

// Collections
import { BudgetCollection } from "../BudgetCollection";
import { EnvelopeCollection } from "../../Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../Ledger/LedgerCollection";
import { TransactionCollection } from "../../Transaction/TransactionCollection";

// Utils
import { reduceTransactions } from "../../../ui/util/reduceTransactions";

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
    // If count is zero then no budget exists for this month. Need to create one
    if (count == 0) {
      // Get last months's budget
      const prevBudget = BudgetCollection.findOne({
        createdAt: new Date(date.getFullYear(), date.getMonth() - 1, 1),
        accountId: user.accountId,
      });
      // If there was a budget last month, create a new budget using last
      // month's budget as a blueprint.
      if (prevBudget) {
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

            if (ledger.isRecurring) {
              // Calculate ledger balance.
              const transactions = TransactionCollection.find({
                accountId: user.accountId,
                ledgerId: ledger._id,
              }).fetch();
              const { income, expense } = reduceTransactions({ transactions });
              newLedger.startingBalance =
                ledger.startingBalance + income - expense;
            }
            // Insert the new ledger
            LedgerCollection.insert(newLedger);
          });
        });
      } else {
        // Create a budget without any blueprint.
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
