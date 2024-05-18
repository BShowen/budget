// Collections
import { AccountCollection } from "../AccountCollection";

// Helpers
import { validateInviteCode } from "./validateInviteCode";
import { validateSignupForm } from "./validateSignupForm";
import { createNewUser } from "./createNewUser";
import { assignUserToAccount } from "./assignUserToAccount";

// This function creates a new user and assigns the user to an existing profile,
// enforcing validation requirements along the way.
// Validation errors are thrown.
// The only errors thrown are Meteor.Error errors.
export function createInvitedProfile({ formData }) {
  validateInviteCode({ inviteCode: formData.inviteCode });
  validateSignupForm({ formData });
  const newUserId = createNewUser({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
  });
  const { _id: accountId } = AccountCollection.findOne(
    {
      $and: [
        { inviteCode: { $exists: true } },
        { inviteCode: formData.inviteCode },
      ],
    },
    { _id: 1 }
  );
  // assign user to account
  assignUserToAccount({ userId: newUserId, accountId });
  // Remove the inviteCode from the account so the link is invalidated.
  AccountCollection.update(
    { _id: accountId },
    { $unset: { inviteCode: true } }
  );
}
