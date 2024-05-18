import { Meteor } from "meteor/meteor";

export function validateSignupForm({ formData }) {
  // Init an empty array to hold error message strings.
  // Each error string should have the syntax "field:message" for example
  // "firstName:First name is required."
  // "confirmPassword:Passwords do not match."
  const validationErrors = [];
  // Iterate through formData and push an error message into the array
  // for each param that is invalid.
  for (let [name, value] of Object.entries(formData)) {
    // Check passwords.
    if (name == "password" || name == "confirmPassword") {
      if (name == "password" && value.trim().length == 0) {
        // Password was not entered.
        validationErrors.push(`password:Password is required.`);
      } else if (name == "confirmPassword" && value.trim().length == 0) {
        // Confirm password was not entered.
        validationErrors.push(`confirmPassword:Confirm password is required.`);
      } else if (name == "password" && value !== formData.confirmPassword) {
        // Passwords don't match.
        validationErrors.push("confirmPassword:Passwords don't match.");
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
}
