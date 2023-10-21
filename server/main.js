import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { UserCollection } from "../imports/api/Users/Users";
import "/imports/startup/server";
import "/imports/api/Users/server/publications.js";

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
});
