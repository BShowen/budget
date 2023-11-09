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
    isIncomeEnvelope: {
      type: Boolean,
      autoValue: function () {
        if (this.isInsert) {
          return this.value || false;
        }
        return;
      },
    },
    name: {
      type: String,
      autoValue: function () {
        const isIncomeEnvelope = this.field("isIncomeEnvelope").value;
        if (
          this.value?.trim()?.toLowerCase() === "income" &&
          !isIncomeEnvelope &&
          this.isUpdate
        ) {
          //Don't allow the envelope to use reserved name "income"
          return "cant use 'income'";
        }
        return;
      },
    },
  },
  {
    clean: { mutate: true },
  }
);
