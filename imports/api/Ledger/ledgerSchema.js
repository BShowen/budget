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
        if (this.isInsert) {
          if (this.isSet) {
            return Number.parseFloat(this.value);
          } else {
            return 0;
          }
        }
      },
    },
    kind: {
      type: String,
      allowedValues: ["income", "expense", "savings"],
    },
    notes: {
      type: String,
      optional: true,
    },
    isRecurring: {
      type: Boolean,
      autoValue: function () {
        if (this.isInsert) {
          // If this ledger is an income ledger then it is not a recurring ledger.
          // If this ledger is a savings then it is recurring.
          switch (this.field("kind").value) {
            case "income":
              return false;
            case "savings":
              return true;
            default:
              // If ledger kind is not set, then default to false. This should
              // never trigger because ledger.kind is a required field.
              return false;
          }
        }
      },
    },
    startingBalance: {
      type: Number,
      optional: true,
      autoValue: function () {
        if (this.isInsert && this.field("kind").isSet) {
          // Only a ledger of kind savings or allocation can have startingBalance
          // because these are recurring ledgers.
          const ledgerKind = this.field("kind").value;
          if (ledgerKind === "savings" || ledgerKind === "allocation") {
            // If the startingBalance is set, return it.
            // Else return zero to be used as startingBalance
            return this.value || 0;
          } else {
            this.unset();
            return undefined;
          }
        }
      },
    },
  },
  { clean: { mutate: true } }
);
