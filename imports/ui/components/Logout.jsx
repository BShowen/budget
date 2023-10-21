import React from "react";
import { Meteor } from "meteor/meteor";

export function Logout() {
  Meteor.logout();
  return <h1>Logged out.</h1>;
}
