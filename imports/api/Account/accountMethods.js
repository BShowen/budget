import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Random } from "meteor/random";
import { AccountCollection } from "./AccountCollection";

Meteor.methods({
  "account.generateSignupUrl"() {
    // User needs to be logged in to create a signup url.
    // Don't run this code on the client.
    // Don'r run this code if user is not admin
    if (!Meteor.userId() || Meteor.isClient || !Meteor.user().isAdmin) {
      return;
    }

    // A helper for setting up and generating the url.
    const signupUrl = {
      protocol: "http://",
      domain: Meteor.isProduction
        ? Meteor.settings.public.domainNames.production
        : Meteor.settings.public.domainNames.development,
      secret: Random.id(),
      generateUrl: function () {
        return `${this.protocol}${this.domain}/${this.secret}/signup`;
      },
    };

    // Store the invite code in the currently logged in user's account.
    AccountCollection.update(
      { _id: Meteor.user().accountId },
      { $set: { inviteCode: signupUrl.secret } }
    );

    return signupUrl.generateUrl();
  },
  "account.validateInviteCode"({ inviteCode }) {
    if (Meteor.isServer) {
      return AccountCollection.countDocuments({ inviteCode }).then((result) => {
        if (result > 0) {
          return { isValidInviteCode: true };
        } else {
          throw new Meteor.Error(
            "account.validateInviteCode",
            "Invalid invite code.",
            "Your invitation has expired."
          );
        }
      });
    }
  },
  "account.signup"(signupParams) {
    if (Meteor.isClient) return;

    // Init an empty array to hold error message strings.
    // Each error string should have the syntax "field:message" for example
    // "firstName:First name is required."
    // "confirmPassword:Passwords do not match."
    const validationErrors = [];
    // Iterate through signupParams and push an error message into the array
    // for each param that is invalid.
    for (let [name, value] of Object.entries(signupParams)) {
      // Check passwords.
      if (name == "password" || name == "confirmPassword") {
        if (name == "password" && value.trim().length == 0) {
          // Password was not entered.
          validationErrors.push(`password:Password is required.`);
        } else if (name == "password" && value.trim().length == 0) {
          // Confirm password was not entered.
          validationErrors.push(
            `confirmPassword:Confirm password is required.`
          );
        } else if (
          name == "password" &&
          value !== signupParams.confirmPassword
        ) {
          // Passwords don't match.
          validationErrors.push("confirmPassword:Passwords don't match");
        }
        continue;
      }

      // Check all other form values.
      // Trim whitespace off all values (Except passwords).
      value = value.trim();
      if (value.length == 0) {
        switch (name) {
          case "firstName":
            validationErrors.push("firstName:First name is required.");
            break;
          case "lastName":
            validationErrors.push("lastName:Last name is required.");
            break;
          case "email":
            validationErrors.push("email:Email is required.");
            break;
        }
      }
    }
    // If any params are invalid, throw an error with the error message(s).
    // Throw new Meteor.Error with the details being errorArray.join("\n");
    if (validationErrors.length > 0) {
      throw new Meteor.Error(
        "account.signup",
        "Validation error",
        validationErrors.join("\n")
      );
    }

    // Id all params are valid, create the user.

    // Create the user
    /* prettier-ignore */
    const {
      firstName,
      lastName,
      email,
      password,
      inviteCode
    } = signupParams;
    Accounts.createUser({
      email,
      password,
      profile: {
        firstName,
        lastName,
      },
    });

    // Associate the user with the account that is linked to the secret.
    const account = AccountCollection.findOne({ inviteCode }, { _id: 1 });
    const newUser = Accounts.findUserByEmail(email);
    Meteor.users.update(
      { _id: newUser._id },
      { $set: { accountId: account._id } }
    );

    try {
      // Remove the inviteCode from the account so the link is invalidated.
      AccountCollection.update(
        { _id: account._id },
        { $unset: { inviteCode: true } }
      );
    } catch (error) {
      console.log("error", error);
    }

    // Send a success response.
    return true;
  },
  "account.resetPassword"({ oldPassword, newPassword, confirmPassword }) {
    // Don't run this method if isClient or user is not logged in.
    if (Meteor.isClient || !Meteor.userId()) return;

    const [passwordError] = validatePasswords({
      password: newPassword,
      confirmPassword,
    });
    if (passwordError) {
      throw new Meteor.Error(
        "account.resetPassword",
        passwordError.split(":")[1],
        passwordError
      );
    }

    // Verify that oldPassword is current password.
    const { error } = Accounts._checkPassword(Meteor.user(), oldPassword);
    if (error) {
      throw new Meteor.Error(
        "account.resetPassword",
        error.reason,
        "oldPassword:Incorrect password."
      );
    }

    Accounts.setPassword(Meteor.userId(), newPassword, { logout: false });
    return true;
  },
});

function validatePasswords({ password, confirmPassword }) {
  const validationErrors = [];
  for (let [name, value] of Object.entries({ password, confirmPassword })) {
    // Check passwords.
    if (name == "password" || name == "confirmPassword") {
      if (name == "password" && value.trim().length == 0) {
        // Password was not entered.
        validationErrors.push(`password:Password is required.`);
      } else if (name == "password" && value.trim().length == 0) {
        // Confirm password was not entered.
        validationErrors.push(`confirmPassword:Confirm password is required.`);
      } else if (name == "password" && value !== confirmPassword) {
        // Passwords don't match.
        validationErrors.push("confirmPassword:Passwords don't match.");
      }
      continue;
    }
  }
  return validationErrors;
}
