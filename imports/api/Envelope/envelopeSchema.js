import SimpleSchema from "simpl-schema";

export const envelopeSchema = new SimpleSchema(
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
    kind: {
      type: String,
      // An envelope can be...
      // income envelope - to track income throughout the month.
      // expense envelopes - to track expenses throughout the month.
      // savings envelope - to track money saved throughout the month.
      allowedValues: ["income", "savings", "expense"],
      // If this value is not provided, then default to expense envelope.
      defaultValue: "expense",
    },
    name: {
      type: String,
      autoValue: function () {
        if (this.isInsert) {
          // this.value will be set when the budget publication is creating a
          // new budget based off a previous month.
          // this.value will be undefined when the user is crating a new
          // envelope.
          return this.value || "new category";
        } else {
          // Don't allow users to rename envelopes to one of the following
          // reserved envelope names
          const reservedName = ["income", "savings", "expense"];
          const isReservedName = reservedName.includes(
            this.value.trim().toLowerCase()
          );
          if (isReservedName) {
            this.unset();
            return undefined;
          } else {
            return this.value;
          }
        }
      },
    },
  },
  {
    clean: { mutate: true },
  }
);
