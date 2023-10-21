import { BudgetCollection } from "../Budget";

// In order to be fetched in real-time to the clients
Meteor.publish("budgets", function () {
  if (!this.userId) {
    return [];
  }

  // get the user.budgetIdList
  const user = Meteor.users.findOne(
    { _id: this.userId },
    { fields: { budgetIdList: 1 } }
  );

  const budgetId = user.budgetIdList[0]; //Always return the most recent budget

  return BudgetCollection.find({ _id: budgetId });
});
