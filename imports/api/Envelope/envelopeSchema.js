import SimpleSchema from "simpl-schema";
import { ledgerSchema } from "../Ledger/ledgerSchema";

export const envelopeSchema = new SimpleSchema({
  budgetId: String, // The budget this document belongs to.
  name: String,
  isAllocated: Boolean, //Envelope can be allocated or unallocated
  startingBalance: Number,
});
