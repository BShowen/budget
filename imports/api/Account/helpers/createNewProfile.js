// Helpers
import { validateAccessCode } from "./validateAccessCode";
import { validateSignupForm } from "./validateSignupForm";
import { createNewUser } from "./createNewUser";
import { createNewAccount } from "./createNewAccount";
import { assignUserToAccount } from "./assignUserToAccount";

// This function creates a new profile, enforcing validation requirements
// along the way. Validation errors are thrown.
// The only errors thrown are Meteor.Error errors.
export function createNewProfile({ formData }) {
  validateAccessCode({ accessCode: formData.accessCode });
  validateSignupForm({ formData });
  const newUserId = createNewUser({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    isAdmin: true, //Because they are the account owner.
  });

  const newAccountId = createNewAccount({});
  assignUserToAccount({ userId: newUserId, accountId: newAccountId });
}
