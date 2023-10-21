import { Meteor } from "meteor/meteor";
import { redirect } from "react-router-dom";

export async function logout() {
  return new Promise((resolve) => {
    Meteor.logout(() => {
      resolve(redirect("/login"));
    });
  });
}
