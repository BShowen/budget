import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Mongo } from "meteor/mongo";
import { BudgetCollection } from "../imports/api/Budgets/Budget";
import "/imports/startup/server";
import "/imports/api/Budgets/server/publications.js";

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

  const newId = () => {
    return new Mongo.ObjectID().valueOf();
  };
  if (!BudgetCollection.find().count()) {
    const budgetIdOne = BudgetCollection.insert({
      //A single budget for the month
      createdAt: new Date(),
      income: {
        expected: 1000.5,
        received: [
          {
            loggedBy: {
              userId: user._id,
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
            },
            createdAt: new Date(),
            name: "Paycheck",
            type: "income",
            amount: 1000.5,
          },
        ],
      },
      envelopes: [
        {
          // category
          name: "food",
          startingBalance: 500.0,
          ledgers: [
            {
              // ledger
              _id: newId(),
              name: "groceries",
              startingBalance: 400.0,
              transactions: [
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "publix",
                  amount: 50.0,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "walmart",
                  amount: 35.0,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
                {
                  createdAt: new Date(),
                  type: "income",
                  name: "walmart",
                  amount: 35.0,
                  notes: "Refund for purchase",
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
              ],
            },
            {
              // ledger
              _id: newId(),
              name: "eating out",
              startingBalance: 100,
              transactions: [
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "Steak n Shake",
                  amount: 4.85,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
              ],
            },
          ],
        },
        {
          // category
          name: "vehicles",
          startingBalance: 330.0,
          ledgers: [
            {
              // ledger
              _id: newId(),
              name: "gas",
              startingBalance: 190,
              transactions: [
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "circle-k",
                  amount: 50.0,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "wawa",
                  amount: 35.0,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
              ],
            },
            {
              // ledger
              _id: newId(),
              name: "insurance",
              startingBalance: 170.0,
              transactions: [
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "state farm",
                  amount: 70.0,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
              ],
            },
          ],
        },
        {
          // category
          name: "utilities",
          startingBalance: 330.0,
          ledgers: [
            {
              // ledger
              _id: newId(),
              name: "internet",
              startingBalance: 85.0,
              transactions: [],
            },
            {
              // ledger
              _id: newId(),
              name: "electric",
              startingBalance: 180.0,
              transactions: [
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "duke energy",
                  amount: 180.0,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
              ],
            },
            {
              // ledger
              _id: newId(),
              name: "water",
              startingBalance: 11.5,
              transactions: [
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "orange county",
                  amount: 11.5,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
              ],
            },
          ],
        },
        {
          // category
          name: "food",
          startingBalance: 100.0,
          ledgers: [
            {
              // ledger
              _id: newId(),
              name: "groceries",
              transactions: [
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "publix",
                  amount: 25.0,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
              ],
            },
            {
              // ledger
              _id: newId(),
              name: "eating out",
              transactions: [
                {
                  createdAt: new Date(),
                  type: "expense",
                  name: "wendy's",
                  amount: 10.0,
                  loggedBy: {
                    userId: user._id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                  },
                },
              ],
            },
          ],
        },
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

    // Meteor.users.update(
    //   { _id: user._id },
    //   { $push: { budgetIdList: { $each: [budgetIdOne], $position: 0 } } }
    // );
  }
});
