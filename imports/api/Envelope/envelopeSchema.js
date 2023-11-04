import SimpleSchema from "simpl-schema";

export const envelopeSchema = new SimpleSchema({
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
  name: String,
});
