import { BudgetCollection } from "./BudgetCollection";
import SimpleSchema from "simpl-schema";

Meteor.methods({
  "budget.createTransaction"(input) {
    if (!this.userId) return;

    const user = Meteor.user();
    const budget = BudgetCollection.findOne({ _id: input.budgetId });
    if (!budget) {
      // No budget found. Throw an error.
      return;
    }

    // Extract the nested array
    // const { transactions } = budget.envelopes
    //   .map((envelope) => envelope.ledgers)
    //   .flat()
    //   .find((ledger) => ledger._id === input.ledgerId);

    // Add the new item to the array
    const newTransaction = {
      loggedBy: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        userId: user._id,
      },
      createdAt: input.createdAt,
      merchant: input.merchant,
      type: input.type,
      amount: Number.parseFloat(input.amount || 0),
      note: input.note,
    };
    console.log(newTransaction);
    return;

    // Replace the modified array within the document
    BudgetCollection.update(
      { _id: input.budgetId },
      { $set: { "envelopes.findObjectInArray.transactions": newArray } }
    );
  },
});
