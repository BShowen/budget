import SimpleSchema from "simpl-schema";
import { transactionSchema } from "../Transaction/transactionSchema";

export const ledgerSchema = new SimpleSchema({
  budgetId: String, // The budget this document belongs to.
  envelopeId: String, // The envelope this document belongs to.
  name: String,
  startingBalance: {
    type: Number,
    optional: true,
  },
});
