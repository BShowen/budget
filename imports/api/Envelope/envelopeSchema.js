import SimpleSchema from "simpl-schema";
import { ledgerSchema } from "../Ledger/ledgerSchema";

export const envelopeSchema = new SimpleSchema({
  name: String,
  isAllocated: Boolean, //Envelope can be allocated or unallocated
  startingBalance: Number,
  ledgers: { type: Array, optional: true },
  "ledgers.$": String, //ref ledgerSchema,
});
