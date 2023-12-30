import SimpleSchema from "simpl-schema";

export const allocationLedgerSchema = new SimpleSchema(
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
      // The starting balance for this month.
      // This is the carryover balance each month.
      // When a new budget is created for the next month, this value is set to the
      // balance from the previous month.
      type: Number,
      defaultValue: 0,
    },
    isAllocationLedger: {
      type: Boolean,
      defaultValue: true,
    },
    allocatedAmount: {
      // The amount that the user want to save this month.
      type: Number,
      autoValue: function () {
        const defaultValue = 0;
        return this.value ? Number.parseFloat(this.value) : defaultValue;
      },
    },
    isRecurring: {
      type: Boolean,
      defaultValue: true,
    },
  },
  { clean: { mutate: true } }
);
