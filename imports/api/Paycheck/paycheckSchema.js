import SimpleSchema from "simpl-schema";

export const paycheckSchema = new SimpleSchema({
  accountId: {
    //The account this document belongs to
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  budgetId: {
    // The budget this document belongs to.
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  loggedBy: Object,
  "loggedBy.userId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  "loggedBy.firstName": String,
  "loggedBy.lastName": String,
  createdAt: Date,
  source: String,
  amount: {
    type: Number,
    min: 0,
  },
  note: {
    type: String,
    optional: true,
  },
});
