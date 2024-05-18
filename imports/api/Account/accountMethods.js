import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Random } from "meteor/random";
import { AccountCollection } from "./AccountCollection";
import { BudgetCollection } from "../Budget/BudgetCollection";
import { EnvelopeCollection } from "../Envelope/EnvelopeCollection";
import { LedgerCollection } from "../Ledger/LedgerCollection";
import { TagCollection } from "../Tag/TagCollection";
import { TransactionCollection } from "../Transaction/TransactionCollection";

// Helpers
import { validateInviteCode } from "./helpers/validateInviteCode";
import { createNewProfile } from "./helpers/createNewProfile";
import { createInvitedProfile } from "./helpers/createInvitedProfile";

Meteor.methods({
  "account.generateSignupUrl"() {
    // User needs to be logged in to create a signup url.
    // Don't run this code on the client.
    // Don'r run this code if user is not admin
    if (!Meteor.userId() || Meteor.isClient || !Meteor.user().profile.isAdmin) {
      return;
    }

    // A helper for setting up and generating the url.
    const signupUrl = {
      protocol: Meteor.isProduction ? "https://" : "http://",
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
      validateInviteCode({ inviteCode });
      return true;
    }
  },
  "account.signup"(formData) {
    if (Meteor.isClient) return;

    if (formData.inviteCode) {
      createInvitedProfile({ formData });
    } else if (formData.accessCode) {
      createNewProfile({ formData });
    } else {
      // No code provided.
      throw new Meteor.Error("account.signup", "undefinedCode");
    }
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
  },
  async "account.deleteAccount"({ password }) {
    // Don't run on client. Don't run if not logged in.
    if (Meteor.isClient || !Meteor.userId()) return;
    const { error } = Accounts._checkPassword(Meteor.user(), password);
    if (error) {
      throw new Meteor.Error(
        "account.deleteAccount",
        error.reason,
        "password:Incorrect password."
      );
    }

    const userCount = await Meteor.users.countDocuments({
      accountId: Meteor.user().accountId,
    });

    // If user is only user on the account then delete everything.
    // If there are multiple users, delete only the user.
    if (userCount > 1) {
      Meteor.users.remove({ _id: Meteor.userId() });
    } else {
      const selector = { accountId: Meteor.user().accountId };
      // Delete all accounts.
      AccountCollection.remove({ _id: selector.accountId });
      // Delete all budgets.
      BudgetCollection.remove(selector);
      // Delete all envelopes.
      EnvelopeCollection.remove(selector);
      // Delete all ledgers.
      LedgerCollection.remove(selector);
      // Delete all tags.
      TagCollection.remove(selector);
      // Delete all transactions.
      TransactionCollection.remove(selector);
      // Delete all users.
      Meteor.users.remove(selector);
    }
  },
  "account.updateRole"({ userId, adminStatus }) {
    // Don't run on server.
    // Don't run if logged out.
    // Don't allow non-admins to run this method.
    if (Meteor.isClient || !this.userId || !Meteor.user().profile.isAdmin)
      return;

    if (
      currentUserHasPrecedence({ targetUserId: userId }) &&
      isSameAccount({ targetUserId: userId })
    ) {
      // A user cannot change the admin status of another user that was created
      // before them.
      // A user cannot change the admin status of users belonging to other accounts
      try {
        // Update the admin status of the user.
        Meteor.users.update(
          { _id: userId },
          { $set: { "profile.isAdmin": adminStatus } }
        );
        // Return the updated admin status of the user.
        return Meteor.users.findOne({ _id: userId }).profile.isAdmin;
      } catch (error) {
        console.log("account.updateRole");
        throw new Meteor.Error("account.updateRole", "Internal server error");
      }
    } else {
      return;
    }
  },
  "account.removeUserAccount"({ targetUserId }) {
    // Don't run on server.
    // Don't run if logged out.
    // Don't allow non-admins to run this method.
    if (Meteor.isClient || !this.userId || !Meteor.user().profile.isAdmin)
      return;

    if (
      currentUserHasPrecedence({ targetUserId }) &&
      isSameAccount({ targetUserId })
    ) {
      return !!Meteor.users.remove({
        _id: targetUserId,
        accountId: Meteor.user().accountId,
      });
    }
  },
});

function isSameAccount({ targetUserId }) {
  // Return true if target user belongs to same account as logged in user.
  return (
    Meteor.user().accountId ==
    Meteor.users.findOne({ _id: targetUserId }).accountId
  );
}

function currentUserHasPrecedence({ targetUserId }) {
  // Return true if current user was created before the target user
  const currentUserCreatedAt = new Date(Meteor.user().createdAt);
  const targetUserCreatedAt = new Date(
    Meteor.users.findOne(
      { _id: targetUserId },
      { fields: { createdAt: 1 } }
    ).createdAt
  );
  return currentUserCreatedAt < targetUserCreatedAt;
}

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
