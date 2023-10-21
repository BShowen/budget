import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { TestCollection } from "../imports/api/testCollection/testCollection";
import "/imports/api/testCollection/server/publications.js";

const SEED_USERNAME = "user";
const SEED_PASSWORD = "pass";

function insertTestData({ vehicle, model, user }) {
  TestCollection.insert({ vehicle, model, userId: user._id });
}

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  // If the Links collection is empty, add some data.
  if (TestCollection.find().count() === 0) {
    [
      {
        vehicle: "Honda",
        model: "Insight",
      },
      {
        vehicle: "Ford",
        model: "Ranger",
      },
    ].map((testData) =>
      TestCollection.insert({ ...testData, userId: user._id })
    );
  }
});
