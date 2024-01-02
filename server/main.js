import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import "/imports/startup/server";
import { BudgetCollection } from "../imports/api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../imports/api/Envelope/EnvelopeCollection";
import { LedgerCollection } from "../imports/api/Ledger/LedgerCollection";
import { TransactionCollection } from "../imports/api/Transaction/TransactionCollection";
import { AccountCollection } from "../imports/api/Account/AccountCollection";
import { TagCollection } from "../imports/api/Tag/TagCollection";

const SEED_1_EMAIL = Meteor.settings.public.demoAccount.email;
const SEED_1_PASSWORD = Meteor.settings.public.demoAccount.password;
const SEED_1_FIRST_NAME = Meteor.settings.public.demoAccount.firstName;
const SEED_1_LAST_NAME = Meteor.settings.public.demoAccount.lastName;

Meteor.startup(() => {
  if (!Accounts.findUserByEmail(SEED_1_EMAIL)) {
    Accounts.createUser({
      email: SEED_1_EMAIL,
      password: SEED_1_PASSWORD,
      profile: {
        firstName: SEED_1_FIRST_NAME,
        lastName: SEED_1_LAST_NAME,
      },
    });
  }

  const user = Accounts.findUserByEmail(SEED_1_EMAIL);

  // Set the user to be an admin.
  Meteor.users.update({ _id: user._id }, { $set: { isAdmin: true } });

  if (!AccountCollection.find().count()) {
    // Create a new account
    const accountId = AccountCollection.insert({});

    // Assign the user to the new account
    Meteor.users.update(
      { _id: user._id },
      {
        $set: {
          accountId,
        },
      }
    );
    // Create some tags
    const fastFoodTag = TagCollection.insert({ accountId, name: "fast food" });

    // Date received from the client
    const clientDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const budgetId = BudgetCollection.insert({
      accountId,
      createdAt: clientDate,
    });

    const incomeEnvelope = EnvelopeCollection.insert({
      accountId,
      budgetId,
      name: "income",
      kind: "income",
    });

    const firstPaycheckLedger = LedgerCollection.insert({
      accountId,
      budgetId: budgetId,
      envelopeId: incomeEnvelope,
      name: "First paycheck",
      allocatedAmount: 1500,
      kind: "income",
    });

    // Add a paycheck
    TransactionCollection.insert({
      accountId,
      budgetId: budgetId,
      envelopeId: incomeEnvelope,
      ledgerId: firstPaycheckLedger,
      createdAt: new Date(2023, 11, 3),
      type: "income",
      merchant: "Paycheck",
      amount: 1500.0,
      loggedBy: {
        userId: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
      },
    });

    const secondPaycheckLeger = LedgerCollection.insert({
      accountId,
      budgetId: budgetId,
      envelopeId: incomeEnvelope,
      name: "Second paycheck",
      allocatedAmount: 1700,
      kind: "income",
    });

    const savingsEnvelope = EnvelopeCollection.insert({
      accountId,
      budgetId,
      kind: "savings",
      name: "savings",
    });

    const savingLedger = LedgerCollection.insert({
      accountId,
      budgetId: budgetId,
      kind: "savings",
      envelopeId: savingsEnvelope,
      name: "emergency fund",
      allocatedAmount: 400,
      startingBalance: 500.0,
    });

    // Add some savings
    TransactionCollection.insert({
      accountId,
      budgetId: budgetId,
      envelopeId: savingsEnvelope,
      ledgerId: savingLedger,
      createdAt: new Date(2023, 11, 3),
      type: "income",
      merchant: "Saving",
      amount: 220.0,
      loggedBy: {
        userId: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
      },
    });

    const [env1, env2, env3, env4] = [
      // Food envelope
      EnvelopeCollection.insert({
        accountId,
        budgetId: budgetId,
        name: "food",
        kind: "expense",
      }),
      // Vehicles envelope
      EnvelopeCollection.insert({
        accountId,
        budgetId: budgetId,
        name: "vehicles",
        kind: "expense",
      }),
      // Utilities envelope
      EnvelopeCollection.insert({
        accountId,
        budgetId: budgetId,
        name: "utilities",
        kind: "expense",
      }),
      // Personal envelope
      EnvelopeCollection.insert({
        accountId,
        budgetId: budgetId,
        name: "personal",
        kind: "expense",
      }),
    ];

    // Ledger for Food envelope.
    const [env1_ledger1] = [
      LedgerCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env1,
        name: "groceries",
        allocatedAmount: 1400,
        kind: "expense",
      }),
    ];
    //  Transactions for Groceries ledger in Food envelope
    const env1_ledger1_transactions = [
      TransactionCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env1,
        ledgerId: env1_ledger1,
        createdAt: new Date(2023, 10, 3),
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
        accountId,
        budgetId: budgetId,
        envelopeId: env1,
        ledgerId: env1_ledger1,
        createdAt: new Date(2023, 10, 8),
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
        accountId,
        budgetId: budgetId,
        envelopeId: env1,
        ledgerId: env1_ledger1,
        createdAt: new Date(2023, 10, 9),
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
      TransactionCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env1,
        ledgerId: env1_ledger1,
        createdAt: new Date(2023, 10, 11),
        type: "expense",
        merchant: "Steak n Shake",
        amount: 4.85,
        tags: [fastFoodTag],
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
        accountId,
        budgetId: budgetId,
        envelopeId: env2,
        name: "gas",
        allocatedAmount: 190,
        kind: "expense",
      }),
      LedgerCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env2,
        name: "insurance",
        allocatedAmount: 170.0,
        kind: "expense",
      }),
    ];
    // Transactions for ledgers in the Vehicle envelope
    const env2_ledger1_transactions = [
      TransactionCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env2,
        ledgerId: env2_ledger1,
        createdAt: new Date(2023, 10, 1),
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
        accountId,
        budgetId: budgetId,
        envelopeId: env2,
        ledgerId: env2_ledger1,
        createdAt: new Date(2023, 10, 9),
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
        accountId,
        budgetId: budgetId,
        envelopeId: env2,
        ledgerId: env2_ledger2,
        createdAt: new Date(2023, 10, 6),
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
        accountId,
        budgetId: budgetId,
        envelopeId: env3,
        name: "internet",
        allocatedAmount: 85.0,
        kind: "expense",
      }),
      LedgerCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env3,
        name: "electric",
        allocatedAmount: 180.0,
        kind: "expense",
      }),
      LedgerCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env3,
        name: "water",
        allocatedAmount: 11.5,
        kind: "expense",
      }),
    ];
    // Transactions for ledgers in the Utilities envelope
    const env3_ledger2_transactions = [
      TransactionCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env3,
        ledgerId: env3_ledger2,
        createdAt: new Date(2023, 10, 1),
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
        accountId,
        budgetId: budgetId,
        envelopeId: env3,
        ledgerId: env3_ledger3,
        createdAt: new Date(2023, 10, 2),
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
        accountId,
        budgetId: budgetId,
        envelopeId: env4,
        name: "subscriptions",
        kind: "expense",
      }),
      LedgerCollection.insert({
        accountId,
        budgetId: budgetId,
        envelopeId: env4,
        name: "misc",
        kind: "expense",
      }),
    ];
    // Transactions for ledgers in the Personal envelope
    const env4_ledger1_transactions = [
      TransactionCollection.insert({
        accountId,
        budgetId: budgetId,
        ledgerId: env4_ledger1,
        envelopeId: env4,
        createdAt: new Date(2023, 10, 10),
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
        accountId,
        budgetId: budgetId,
        ledgerId: env4_ledger1,
        envelopeId: env4,
        createdAt: new Date(2023, 10, 3),
        type: "expense",
        merchant: "stumptown coffee roasters",
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
        accountId,
        budgetId: budgetId,
        ledgerId: env4_ledger2,
        envelopeId: env4,
        createdAt: new Date(2023, 10, 9),
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
  }
});
