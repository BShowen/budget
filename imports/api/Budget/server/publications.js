import { Meteor } from "meteor/meteor";

// Collections
import { BudgetCollection } from "../BudgetCollection";

Meteor.publish("budget", function (date) {
  console.log({ date });
  // Return the budget specified by the date
  if (!this.userId || !date) {
    return [];
  }

  // get the user.budgetIdList
  const user = Meteor.user();

  return BudgetCollection.find({
    accountId: user.accountId,
    createdAt: date,
  });
});
