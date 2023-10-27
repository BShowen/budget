import SimpleSchema from "simpl-schema";
import { ledgerSchema } from "../Ledger/ledgerSchema";

export const envelopeSchema = new SimpleSchema({
  name: String,
  startingBalance: Number,
  ledgers: { type: Array, optional: true },
  "ledgers.$": String, //ref ledgerSchema,
});
