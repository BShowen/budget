import SimpleSchema from "simpl-schema";

export const budgetSchema = new SimpleSchema(
  {
    accountId: {
      //The account this document belongs to
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    createdAt: Date,
    income: Object,
    "income.expected": Number,
    "income.received": { type: Array, optional: true },
    "income.received.$": String, //ref transactionSchema,
  },
  { clean: { mutate: true } }
);
