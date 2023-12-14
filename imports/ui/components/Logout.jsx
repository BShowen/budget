import { redirect } from "react-router-dom";
export async function logoutLoader() {
  await new Promise((resolve) => Meteor.logout(() => resolve(null)));
  return redirect("/login");
}
