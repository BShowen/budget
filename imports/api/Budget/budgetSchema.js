import SimpleSchema from "simpl-schema";

export const budgetSchema = new SimpleSchema({
  createdAt: Date,
  income: Object,
  "income.expected": Number,
  "income.received": { type: Array, optional: true },
  "income.received.$": String, //ref transactionSchema,
  envelopes: { type: Array, optional: true },
  "envelopes.$": String, //ref envelopeSchema,
});
