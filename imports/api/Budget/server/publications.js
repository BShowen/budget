import { Meteor } from "meteor/meteor";

// Collections
import { BudgetCollection } from "../BudgetCollection";

// Utils
import { populateBudget } from "./util/populateBudget";

Meteor.publish("budgets", function () {
  if (!this.userId) {
    return [];
  }

  // get the user.budgetIdList
  const user = Meteor.user();

  //Always return the most recent budget
  // This should be changed to "Return the budget with the month/year same as today"
  const budgetId = user.budgetIdList[0];

  const budget = populateBudget(BudgetCollection.findOne({ _id: budgetId }));

  this.added("budgets", budget._id, budget);
  this.ready();
});
