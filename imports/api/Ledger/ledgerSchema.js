import SimpleSchema from "simpl-schema";
import { transactionSchema } from "../Transaction/transactionSchema";

export const ledgerSchema = new SimpleSchema({
  _id: String,
  name: String,
  startingBalance: {
    type: Number,
    optional: true,
  },
  transactions: { type: Array, optional: true },
  "transactions.$": String, //ref transactionSchema,
});
