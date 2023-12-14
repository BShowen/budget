export function isLoggedIn() {
  if (Meteor.loggingOut()) {
    // A logout is in progress, user is essentially logged out.
    return false;
  } else {
    return !!Meteor.userId();
  }
}
