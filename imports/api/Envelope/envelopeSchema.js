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
    isSavingsEnvelope: {
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
        // Don't allow user to rename an envelope to "income" or "savings".
        // Return "untitled" if they try.
        const isIncomeEnvelope = this.field("isIncomeEnvelope").value;
        const isSavingsEnvelope = this.field("isSavingsEnvelope").value;
        const value = this.value.trim().toLowerCase();
        const canEdit =
          !isIncomeEnvelope &&
          !isSavingsEnvelope &&
          value !== "income" &&
          value !== "savings";
        if (this.isInsert || canEdit) {
          return;
        } else {
          this.unset();
          return;
        }
      },
    },
  },
  {
    clean: { mutate: true },
  }
);
