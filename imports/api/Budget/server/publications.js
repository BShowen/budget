import { Meteor } from "meteor/meteor";

// Collections
import { BudgetCollection } from "../BudgetCollection";
import { EnvelopeCollection } from "../../Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../Ledger/LedgerCollection";
import { TransactionCollection } from "../../Transaction/TransactionCollection";

// Utils
import { reduceTransactions } from "../../../ui/util/reduceTransactions";

Meteor.publish("budget", function (date) {
  // Return the budget that has a createdAt date that is GTE to provided date.
  // If none, create a new budget and return it.

  // User must be logged in and provide a date.
  if (!this.userId || !date) {
    return this.ready();
  }

  const user = Meteor.user();

  const currentBudget = BudgetCollection.findOne({
    accountId: user.accountId,
    createdAt: {
      $gte: date,
      $lte: new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate() - 1
      ),
    },
  });

  if (currentBudget) {
    return BudgetCollection.find({
      accountId: user.accountId,
      _id: currentBudget._id,
    });
  }

  // Get the most recent document that was created on/before the provided date.
  const prevBudget = BudgetCollection.findOne(
    {
      accountId: user.accountId,
      createdAt: {
        $lte: new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate() - 1
        ),
      },
    },
    { sort: { createdAt: -1 } }
  );
  if (prevBudget) {
    // Get previous envelopes
    const prevEnvelopes = EnvelopeCollection.find({
      accountId: user.accountId,
      budgetId: prevBudget._id,
    }).fetch();
    // Get previous ledgers
    const prevLedgers = LedgerCollection.find({
      accountId: user.accountId,
      budgetId: prevBudget._id,
    }).fetch();
    // Create new budget.
    const newBudgetId = BudgetCollection.insert({
      accountId: user.accountId,
      createdAt: date,
    });

    // Iterate through each previous envelope...
    prevEnvelopes.forEach((envelope) => {
      // Get the previous ledgers for this envelope.
      const ledgers = prevLedgers.filter(
        (ledger) => ledger.envelopeId == envelope._id
      );

      // Create a new envelope based off the old envelope and associate it with
      // the new budget.
      const newEnvelope = { ...envelope, budgetId: newBudgetId };
      // Remove the old _id from the envelope so Mongo will generate a new one.
      delete newEnvelope._id;
      // Insert the new envelope
      const newEnvelopeId = EnvelopeCollection.insert(newEnvelope);

      // For this envelope, iterate through each ledger and create a new ledger
      // based off the previous ledger and associate the new ledger with the
      // new envelope.
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
          newLedger.startingBalance = ledger.startingBalance + income - expense;
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

  // If this point is reached, then a new budget has been created.
  // Return the most recent budget.
  return BudgetCollection.find(
    {
      accountId: user.accountId,
      createdAt: {
        $gte: date,
        $lte: new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate() - 1
        ),
      },
    },
    { sort: { createdAt: -1 }, limit: 1 }
  );
});
