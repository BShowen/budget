import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import "/imports/startup/server";
import { BudgetCollection } from "../imports/api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../imports/api/Envelope/EnvelopCollection";
import { LedgerCollection } from "../imports/api/Ledger/LedgerCollection";
import { TransactionCollection } from "../imports/api/Transaction/TransactionCollection";

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
    const budgetIdOne = BudgetCollection.insert({
      //A single budget for the month
      createdAt: new Date(),
      income: {
        expected: 1000.5,
        received: [
          TransactionCollection.insert({
            loggedBy: {
              userId: user._id,
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
            },
            createdAt: new Date(),
            merchant: "Paycheck",
            type: "income",
            amount: 1000.5,
          }),
        ],
      },
      envelopes: [
        EnvelopeCollection.insert({
          name: "food",
          isAllocated: false,
          startingBalance: 500.0,
          ledgers: [
            LedgerCollection.insert({
              name: "groceries",
              transactions: [
                TransactionCollection.insert({
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
              ],
            }),
            LedgerCollection.insert({
              name: "eating out",
              transactions: [
                TransactionCollection.insert({
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
              ],
            }),
          ],
        }),
        EnvelopeCollection.insert({
          name: "vehicles",
          isAllocated: true,
          startingBalance: 360.0,
          ledgers: [
            LedgerCollection.insert({
              name: "gas",
              startingBalance: 190,
              transactions: [
                TransactionCollection.insert({
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
              ],
            }),
            LedgerCollection.insert({
              name: "insurance",
              startingBalance: 170.0,
              transactions: [
                TransactionCollection.insert({
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
              ],
            }),
          ],
        }),
        EnvelopeCollection.insert({
          name: "utilities",
          isAllocated: true,
          startingBalance: 276.5,
          ledgers: [
            LedgerCollection.insert({
              name: "internet",
              startingBalance: 85.0,
              transactions: [],
            }),
            LedgerCollection.insert({
              name: "electric",
              startingBalance: 180.0,
              transactions: [
                TransactionCollection.insert({
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
              ],
            }),
            LedgerCollection.insert({
              name: "water",
              startingBalance: 11.5,
              transactions: [
                TransactionCollection.insert({
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
              ],
            }),
          ],
        }),
        EnvelopeCollection.insert({
          name: "bradley - personal",
          isAllocated: false,
          startingBalance: 100.0,
          ledgers: [
            LedgerCollection.insert({
              name: "subscriptions",
              transactions: [
                TransactionCollection.insert({
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
              ],
            }),
            LedgerCollection.insert({
              name: "misc",
              transactions: [
                TransactionCollection.insert({
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
              ],
            }),
          ],
        }),
      ],
    });

    Meteor.users.update(
      { _id: user._id },
      {
        $set: {
          budgetIdList: [budgetIdOne],
        },
      }
    );
  }
});
