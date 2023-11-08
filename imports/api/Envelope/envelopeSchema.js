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
    name: {
      type: String,
      autoValue: function () {
        if (this.isUpdate && this.value?.trim()?.toLowerCase() === "income") {
          //Don't allow the envelope to use reserved name "income"
          return "cant use 'income'";
        }

        if (this.isInsert) {
          // Default value is "untitled"
          return "untitled";
        }
      },
    },
  },
  {
    clean: { mutate: true },
  }
);
