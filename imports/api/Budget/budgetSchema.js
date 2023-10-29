import SimpleSchema from "simpl-schema";

export const budgetSchema = new SimpleSchema({
  // owners: { type: Array }, //There can be multiple budget owners. i.e. shared accounts
  // "owners.$": String, //ref user who can manage this budget.
  createdAt: Date,
  income: Object,
  "income.expected": Number,
  "income.received": { type: Array, optional: true },
  "income.received.$": String, //ref transactionSchema,
});
