import { Meteor } from "meteor/meteor";

export function validateAccessCode({ accessCode }) {
  if (accessCode !== Meteor.settings.accessCode) {
    throw new Meteor.Error("account.accessCode", "invalidAccessCode");
  }
}
