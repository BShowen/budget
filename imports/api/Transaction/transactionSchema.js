import SimpleSchema from "simpl-schema";

export const transactionSchema = new SimpleSchema({
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
