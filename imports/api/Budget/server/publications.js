import { Meteor } from "meteor/meteor";

// Collections
import { BudgetCollection } from "../BudgetCollection";
import { EnvelopeCollection } from "../../Envelope/EnvelopeCollection";
import { LedgerCollection } from "../../Ledger/LedgerCollection";
import { TransactionCollection } from "../../Transaction/TransactionCollection";

// Utils
import { reduceTransactions } from "../../../ui/util/reduceTransactions";

// This resolver returns a budget document.
// The budget doc is either an existing document or one is created and returned.
Meteor.publish("budget", function (timestamp) {
  // User must be logged in and provide a date.
  if (!this.userId || !timestamp) {
    return this.ready();
  }

  const user = Meteor.user();

  // Try to find the document that matches the provided date.
  const currentBudget = BudgetCollection.findOne({
    accountId: user.accountId,
    createdAt: {
      $gte: timestamp,
      $lte: timestamp + 86400000, //One day
    },
  });

  // If currentBudget is truthy then return that document.
  // Done.
  if (currentBudget) {
    // This resolver must return a cursor, which is why I don't return the
    // document stored in the variable "currentBudget", because currentBudget
    // is referencing a document, not a mongo cursor.
    return BudgetCollection.find({
      accountId: user.accountId,
      _id: currentBudget._id,
    });
  }

  // If this portion of the resolver is reached then a budget with the provided
  // date could not be found. One needs to be created and returned.

  // Try to find the most recent budget that exists for this account.
  // This will be used as a blueprint to create the new budget that will be
  // returned.
  const prevBudget = BudgetCollection.findOne(
    {
      accountId: user.accountId,
      createdAt: {
        $lte: timestamp + 86400000, //One day
      },
    },
    { sort: { createdAt: -1 } }
  );

  // if prevBudget is truthy, then this account has a budget that can be used
  // as a blueprint to create a new budget.
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
      createdAt: timestamp,
    });

    // Iterate through each previous envelope...
    prevEnvelopes.forEach((prevEnvelope) => {
      // Create a new envelope based off the old envelope and associate it with
      // the new budget.
      const newEnvelope = { ...prevEnvelope, budgetId: newBudgetId };
      // Remove the old _id from the envelope so Mongo will generate a new one.
      delete newEnvelope._id;
      // Insert the new envelope
      const newEnvelopeId = EnvelopeCollection.insert(newEnvelope);

      // Get the previous ledgers for this envelope.
      const ledgers = prevLedgers.filter(
        (ledger) => ledger.envelopeId == prevEnvelope._id
      );
      // Iterate through each of the previous envelope's ledgers and create a
      // new ledger based off the previous ledger and associate the new ledger
      // with the new envelope.
      ledgers.forEach((prevLedger) => {
        // Create the new ledger
        const newLedger = {
          ...prevLedger,
          budgetId: newBudgetId,
          envelopeId: newEnvelopeId,
        };
        // Remove the old _id from the ledger
        delete newLedger._id;

        // If this is a recurring ledger then that means this ledgers starting
        // balance must be calculated and set.
        // the ledger's starting balance is going to be the previous ledger's
        // starting balance plus any income transactions, minus any expense
        // transactions
        if (prevLedger.isRecurring) {
          // Get a list of the previous ledger's transactions
          const transactions = TransactionCollection.find({
            accountId: user.accountId,
            allocations: { $elemMatch: { ledgerId: prevLedger._id } },
          }).fetch();

          // Group the transactions by type - "expense" or "income"
          const { income: prevIncome, expense: prevExpense } =
            reduceTransactions({ transactions });

          // Calculate and set the new ledger's starting balance
          newLedger.startingBalance =
            Math.round(
              (prevLedger.startingBalance + prevIncome - prevExpense) * 100
            ) / 100;
        }

        // Insert the new ledger into the DB.
        LedgerCollection.insert(newLedger);
      });
    });
  } else {
    // Create a budget without any blueprint.
    const budgetId = BudgetCollection.insert({
      accountId: user.accountId,
      createdAt: timestamp,
    });
    // Create income Envelope
    EnvelopeCollection.insert({
      budgetId,
      accountId: user.accountId,
      kind: "income",
      name: "income",
    });
    // Create savings Envelope
    EnvelopeCollection.insert({
      budgetId,
      accountId: user.accountId,
      kind: "savings",
      name: "savings",
    });
  }

  // If this point is reached, then a new budget has been created.
  // Return the most recent budget.
  return BudgetCollection.find(
    {
      accountId: user.accountId,
      createdAt: {
        $gte: timestamp,
        $lte: timestamp + 86400000, //One day
      },
    },
    { sort: { createdAt: -1 }, limit: 1 }
  );
});

Meteor.publish("allBudgets", function () {
  if (!this.userId) {
    return this.ready();
  }
  const { accountId } = Meteor.user();
  return BudgetCollection.find({ accountId });
});
