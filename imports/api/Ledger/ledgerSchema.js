import SimpleSchema from "simpl-schema";

export const ledgerSchema = new SimpleSchema({
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
  envelopeId: {
    // The envelope this document belongs to.
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: String,
  startingBalance: {
    type: Number,
    defaultValue: 0.0,
  },
});
