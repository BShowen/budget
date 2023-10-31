import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import "/imports/startup/server";
import { BudgetCollection } from "../imports/api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../imports/api/Envelope/EnvelopCollection";
import { LedgerCollection } from "../imports/api/Ledger/LedgerCollection";
import { TransactionCollection } from "../imports/api/Transaction/TransactionCollection";
import { PaycheckCollection } from "../imports/api/Paycheck/PaycheckCollection";

const SEED_EMAIL = "bshowen@me.com";
const SEED_PASSWORD = "123123123";
const SEED_FIRST_NAME = "bradley";
const SEED_LAST_NAME = "showen";

Meteor.startup(() => {
  if (!Accounts.findUserByEmail(SEED_EMAIL)) {
    Accounts.createUser({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      profile: {
        firstName: SEED_FIRST_NAME,
        lastName: SEED_LAST_NAME,
      },
    });
  }
  const user = Accounts.findUserByEmail(SEED_EMAIL);

  if (!BudgetCollection.find().count()) {
    const budgetId = BudgetCollection.insert({
      //A single budget for the month
      createdAt: new Date(),
      income: {
        expected: 1000.5,
      },
    });

    const paycheckId = PaycheckCollection.insert({
      budgetId: budgetId,
      createdAt: new Date(),
      source: "Paycheck",
      amount: 1000.5,
      loggedBy: {
        userId: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
      },
    });
    const [env1, env2, env3, env4] = [
      // Food envelope
      EnvelopeCollection.insert({
        budgetId: budgetId,
        name: "food",
        isAllocated: false,
        startingBalance: 500.0,
      }),
      // Vehicles envelope
      EnvelopeCollection.insert({
        budgetId: budgetId,
        name: "vehicles",
        isAllocated: true,
      }),
      // Utilities envelope
      EnvelopeCollection.insert({
        budgetId: budgetId,
        name: "utilities",
        isAllocated: true,
      }),
      // Personal envelope
      EnvelopeCollection.insert({
        budgetId: budgetId,
        name: "bradley - personal",
        isAllocated: false,
        startingBalance: 100.0,
      }),
    ];

    // Ledgers for Food envelope
    const [env1_ledger1, env1_ledger2] = [
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env1,
        name: "groceries",
      }),
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env1,
        name: "eating out",
      }),
    ];
    // Transactions for edgers in the Food envelope
    const env1_ledger1_transactions = [
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env1,
        ledgerId: env1_ledger1,
        createdAt: new Date(),
        type: "expense",
        merchant: "publix",
        amount: 50.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env1,
        ledgerId: env1_ledger1,
        createdAt: new Date(),
        type: "expense",
        merchant: "walmart",
        amount: 35.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env1,
        ledgerId: env1_ledger1,
        createdAt: new Date(),
        type: "income",
        merchant: "walmart",
        amount: 35.0,
        notes: "Refund for purchase",
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];
    const env1_ledger2_transactions = [
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env1,
        ledgerId: env1_ledger2,
        createdAt: new Date(),
        type: "expense",
        merchant: "Steak n Shake",
        amount: 4.85,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];

    // Ledgers for Vehicle envelope
    const [env2_ledger1, env2_ledger2] = [
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env2,
        name: "gas",
        startingBalance: 190,
      }),
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env2,
        name: "insurance",
        startingBalance: 170.0,
      }),
    ];
    // Transactions for ledgers in the Vehicle envelope
    const env2_ledger1_transactions = [
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env2,
        ledgerId: env2_ledger1,
        createdAt: new Date(),
        type: "expense",
        merchant: "circle-k",
        amount: 50.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env2,
        ledgerId: env2_ledger1,
        createdAt: new Date(),
        type: "expense",
        merchant: "wawa",
        amount: 35.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];
    const env2_ledger2_transactions = [
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env2,
        ledgerId: env2_ledger2,
        createdAt: new Date(),
        type: "expense",
        merchant: "state farm",
        amount: 70.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];

    // Ledgers for Utilities envelope
    const [env3_ledger1, env3_ledger2, env3_ledger3] = [
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env3,
        name: "internet",
        startingBalance: 85.0,
      }),
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env3,
        name: "electric",
        startingBalance: 180.0,
      }),
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env3,
        name: "water",
        startingBalance: 11.5,
      }),
    ];
    // Transactions for ledgers in the Utilities envelope
    const env3_ledger2_transactions = [
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env3,
        ledgerId: env3_ledger2,
        createdAt: new Date(),
        type: "expense",
        merchant: "duke energy",
        amount: 180.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];
    const env3_ledger_3_transactions = [
      TransactionCollection.insert({
        budgetId: budgetId,
        envelopeId: env3,
        ledgerId: env3_ledger3,
        createdAt: new Date(),
        type: "expense",
        merchant: "orange county",
        amount: 11.5,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];

    // Ledgers for the Personal envelope
    const [env4_ledger1, env4_ledger2] = [
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env4,
        name: "subscriptions",
      }),
      LedgerCollection.insert({
        budgetId: budgetId,
        envelopeId: env4,
        name: "misc",
      }),
    ];
    // Transactions for ledgers in the Personal envelope
    const env4_ledger1_transactions = [
      TransactionCollection.insert({
        budgetId: budgetId,
        ledgerId: env4_ledger1,
        envelopeId: env4,
        createdAt: new Date(),
        type: "expense",
        merchant: "youtube",
        amount: 15.8,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        budgetId: budgetId,
        ledgerId: env4_ledger1,
        envelopeId: env4,
        createdAt: new Date(),
        type: "expense",
        merchant: "stumptown",
        amount: 17.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];
    const env4_ledger2_transactions = [
      TransactionCollection.insert({
        budgetId: budgetId,
        ledgerId: env4_ledger2,
        envelopeId: env4,
        createdAt: new Date(),
        type: "expense",
        merchant: "amazon",
        amount: 13.58,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];

    Meteor.users.update(
      { _id: user._id },
      {
        $set: {
          budgetIdList: [budgetId],
        },
      }
    );
  }
});
