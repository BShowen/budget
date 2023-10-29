import SimpleSchema from "simpl-schema";

export const transactionSchema = new SimpleSchema({
  budgetId: String, // The budget this document belongs to.
  envelopeId: String, // The envelope this document belongs to.
  ledgerId: String, // The ledger this document belongs to.
  loggedBy: Object,
  "loggedBy.userId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  "loggedBy.firstName": String,
  "loggedBy.lastName": String,
  createdAt: Date,
  merchant: String,
  type: {
    type: String,
    allowedValues: ["income", "expense"],
  },
  amount: {
    type: Number,
    min: 0,
  },
  note: {
    type: String,
    optional: true,
  },
});
