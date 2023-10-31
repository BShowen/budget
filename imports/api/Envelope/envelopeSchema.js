import SimpleSchema from "simpl-schema";

export const envelopeSchema = new SimpleSchema(
  {
    budgetId: String, // The budget this document belongs to.
    name: String,
    isAllocated: Boolean, // Envelope can be allocated or unallocated
    startingBalance: {
      type: Number,
      optional: true,
      custom() {
        const isAllocated = this.field("isAllocated").value;
        const startingBalance = this.value;

        // Check if isAllocated is false and startingBalance is not provided
        if (
          !isAllocated &&
          (startingBalance === null || startingBalance === undefined)
        ) {
          return "requiredStartingBalance";
        }

        // Check if isAllocated is true and startingBalance is provided
        if (
          isAllocated &&
          startingBalance !== null &&
          startingBalance !== undefined
        ) {
          return "startingBalanceNotAllowed";
        }
      },
    },
  },
  {
    messages: {
      requiredStartingBalance:
        "Starting balance is required when the envelope is unallocated.",
      startingBalanceNotAllowed:
        "Starting balance is not allowed when the envelope is allocated.",
    },
  }
);
