import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import "/imports/startup/server";
import { BudgetCollection } from "../imports/api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../imports/api/Envelope/EnvelopeCollection";
import { LedgerCollection } from "../imports/api/Ledger/LedgerCollection";
import { TransactionCollection } from "../imports/api/Transaction/TransactionCollection";
import { AccountCollection } from "../imports/api/Account/AccountCollection";
import { TagCollection } from "../imports/api/Tag/TagCollection";

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function getRandomTimestamp() {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    getRandomIntInclusive(1, new Date().getDate())
  ).getTime();
}

Meteor.startup(() => {
  if (Meteor.isProduction) return;
  const SEED_1_EMAIL = Meteor.settings.public.demoAccount.email;
  const SEED_1_PASSWORD = Meteor.settings.public.demoAccount.password;
  const SEED_1_FIRST_NAME = Meteor.settings.public.demoAccount.firstName;
  const SEED_1_LAST_NAME = Meteor.settings.public.demoAccount.lastName;
  // This is not production, create a demo account for easy testing.
  if (!Accounts.findUserByEmail(SEED_1_EMAIL)) {
    Accounts.createUser({
      email: SEED_1_EMAIL,
      password: SEED_1_PASSWORD,
      profile: {
        firstName: SEED_1_FIRST_NAME,
        lastName: SEED_1_LAST_NAME,
        isAdmin: true,
      },
    });
  }

  const user = Accounts.findUserByEmail(SEED_1_EMAIL);

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
    const clientDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();

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
      isCategorized: "true",
      accountId,
      budgetId: budgetId,
      createdAt: getRandomTimestamp(),
      type: "income",
      merchant: "Paycheck",
      amount: 1500.0,
      allocations: [
        {
          amount: 1500.0,
          envelopeId: incomeEnvelope,
          ledgerId: firstPaycheckLedger,
        },
      ],
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
      isCategorized: "true",
      accountId,
      budgetId: budgetId,
      createdAt: getRandomTimestamp(),
      type: "income",
      merchant: "Saving",
      allocations: [
        {
          envelopeId: savingsEnvelope,
          ledgerId: savingLedger,
          amount: 220.0,
        },
      ],
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
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "publix",
        allocations: [
          {
            envelopeId: env1,
            ledgerId: env1_ledger1,
            amount: 50.0,
          },
        ],
        amount: 50.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "walmart",
        allocations: [
          {
            envelopeId: env1,
            ledgerId: env1_ledger1,
            amount: 35.0,
          },
        ],
        amount: 35.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "income",
        merchant: "walmart",
        allocations: [
          {
            envelopeId: env1,
            ledgerId: env1_ledger1,
            amount: 35.0,
          },
        ],
        amount: 35.0,
        notes: "Refund for purchase",
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "Steak n Shake",
        allocations: [
          {
            envelopeId: env1,
            ledgerId: env1_ledger1,
            amount: 4.85,
          },
        ],
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
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "circle-k",
        allocations: [
          {
            envelopeId: env2,
            ledgerId: env2_ledger1,
            amount: 50.0,
          },
        ],
        amount: 50.0,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "wawa",
        amount: 35.0,
        allocations: [
          {
            envelopeId: env2,
            ledgerId: env2_ledger1,
            amount: 35.0,
          },
        ],
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
    ];
    const env2_ledger2_transactions = [
      TransactionCollection.insert({
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "state farm",
        allocations: [
          {
            envelopeId: env2,
            ledgerId: env2_ledger2,
            amount: 70.0,
          },
        ],
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
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "duke energy",
        allocations: [
          {
            envelopeId: env3,
            ledgerId: env3_ledger2,
            amount: 180.0,
          },
        ],
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
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "orange county",
        allocations: [
          {
            envelopeId: env3,
            ledgerId: env3_ledger3,
            amount: 11.5,
          },
        ],
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
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "youtube",
        allocations: [
          {
            ledgerId: env4_ledger1,
            envelopeId: env4,
            amount: 15.8,
          },
        ],
        amount: 15.8,
        loggedBy: {
          userId: user._id,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
      }),
      TransactionCollection.insert({
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "stumptown coffee roasters",
        allocations: [
          {
            ledgerId: env4_ledger1,
            envelopeId: env4,
            amount: 17.0,
          },
        ],
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
        isCategorized: "true",
        accountId,
        budgetId: budgetId,
        createdAt: getRandomTimestamp(),
        type: "expense",
        merchant: "amazon",
        allocations: [
          {
            ledgerId: env4_ledger2,
            envelopeId: env4,
            amount: 13.58,
          },
        ],
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
