import SimpleSchema from "simpl-schema";

export const ledgerSchema = new SimpleSchema(
  {
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
    name: {
      type: String,
    },
    startingBalance: {
      type: Number,
      autoValue: function () {
        const defaultValue = 0;
        return this.value ? Number.parseFloat(this.value) : defaultValue;
      },
    },
  },
  { clean: { mutate: true } }
);
