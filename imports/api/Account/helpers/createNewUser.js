import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

// Create a new user and return the _id of the new user
export function createNewUser({
  firstName,
  lastName,
  email,
  password,
  isAdmin = false,
}) {
  // Verify the email address doesn't already exist.
  const isEmailTaken = !!Meteor.users.findOne({ "emails.address": email });

  if (isEmailTaken) {
    throw new Meteor.Error(
      "account.createNewUser",
      "emailTaken",
      "email:email is taken"
    );
  }

  // Create a new user.
  // Accounts.createUser returns the _id of the new doc.
  return Accounts.createUser({
    email,
    password,
    profile: {
      firstName,
      lastName,
      isAdmin,
    },
  });
}
