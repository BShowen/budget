import { Meteor } from "meteor/meteor";

// Collections
import { AccountCollection } from "../AccountCollection";

export function validateInviteCode({ inviteCode }) {
  const isCodeValid = !!AccountCollection.findOne({
    $and: [{ inviteCode: { $exists: true } }, { inviteCode }],
  });
  console.log({ inviteCode });
  if (!isCodeValid) {
    throw new Meteor.Error("account.invitationCode", "invalidInviteCode");
  }
}
