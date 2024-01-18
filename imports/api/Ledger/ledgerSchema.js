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
          return 0; // default value
        }

        if (this.isSet) {
          return Number.parseFloat(this.value);
        }
      },
    },
    kind: {
      type: String,
      allowedValues: ["income", "expense", "savings", "allocation"],
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
          // If this ledger is a savings or allocation then it is recurring.
          switch (this.field("kind").value) {
            case "income":
              return false;
            case "savings":
              return true;
            case "allocation":
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
    allocation: {
      type: Object,
      optional: function () {
        if (this.isInsert) {
          if (this.field("kind").value === "allocation") {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    },
    "allocation.runningTotal": {
      // This total is carried over and calculated each month when a new budget
      // is created. This field is updated by the Budget publication.
      type: Number,
      defaultValue: 0,
      optional: function () {
        if (this.isInsert) {
          if (this.field("kind").value === "allocation") {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    },
    "allocation.goalAmount": {
      type: Number,
      optional: function () {
        if (this.isInsert) {
          if (this.field("kind").value === "allocation") {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    },
    "allocation.endDate": {
      type: Date,
      optional: function () {
        if (this.isInsert) {
          if (this.field("kind").value === "allocation") {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    },
  },
  { clean: { mutate: true } }
);
