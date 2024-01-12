import { redirect } from "react-router-dom";
import { Meteor } from "meteor/meteor";
export async function logoutLoader() {
  window.localStorage.clear();
  await new Promise((resolve) => Meteor.logout(() => resolve(null)));
  return redirect("/login");
}
