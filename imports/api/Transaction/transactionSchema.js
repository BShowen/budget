import SimpleSchema from "simpl-schema";

export const transactionSchema = new SimpleSchema(
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
    ledgerId: {
      // The ledger this document belongs to.
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
    merchant: {
      type: String,
      autoValue: function () {
        if (this.isSet) {
          return this.value.toLowerCase();
        }
        return undefined;
      },
    },
    type: {
      type: String,
      allowedValues: ["income", "expense"],
    },
    amount: {
      type: Number,
      min: 0.01,
      autoValue: function () {
        if (this.isSet) {
          // If value contains a comma then Number.parseFloat() will parse only
          // the digits before the comma. The comma needs to be removed.
          const parsedValue = this.value.toString().split(",").join("");
          return Number.parseFloat(parsedValue);
        }
        return undefined;
      },
    },
    note: {
      type: String,
      optional: true,
    },
    tags: {
      type: Array,
      optional: true,
    },
    "tags.$": {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  },
  { clean: { mutate: true } }
);
