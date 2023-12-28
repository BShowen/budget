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
    allocatedAmount: {
      type: Number,
      autoValue: function () {
        const defaultValue = 0;
        return this.value ? Number.parseFloat(this.value) : defaultValue;
      },
    },
    isIncomeLedger: {
      type: Boolean,
      required: false,
    },
    isSavingsLedger: {
      type: Boolean,
      required: false,
    },
    isRecurring: {
      type: Boolean,
      // defaultValue: false,
      autoValue: function () {
        return !!this.field("isSavingsLedger") || false;
      },
    },
    startingBalance: {
      // Only a ledger of type savings can have a startingBalance.
      // All other ledgers use allocatedAmount
      type: Number,
      optional: true,
      autoValue: function () {
        // A user is never allowed to set the startingBalance attribute.
        // The startingBalance is ALWAYS set to zero upon savings ledger
        // creation. The only way the startingBalance gets updated is when next
        // month's budget is being created. The server will calculate this attribute
        const isSavingsLedger = this.field("isSavingsLedger").value;
        // If this is a savingsLedger then this attribute can be updated
        // (by the server). Otherwise, this attribute is not used and is not
        // allowed to be updated.
        if (isSavingsLedger) {
          // A user is creating a new savings ledger. Set the balance to zero.
          // this.value will be set when the server is creating a new budget.
          // this.value will not be set when a user is creating a new savings
          // ledger, therefore the startingBalance needs to be set to zero.
          // this.value will be returned when a ledger is being created for next
          // month. If a ledger is being created by the user, the then
          // this.value will be undefined and zero will be returned. We need to
          // return zero when a new savings ledger is being created because this
          // is the startingBalance. If zero is not returned then the client
          // will try to calculate the ledger balance and get NaN
          return this.value || 0;
        } else {
          this.unset();
          return;
        }
      },
    },
  },
  { clean: { mutate: true } }
);
