import { Mongo } from "meteor/mongo";
import { ledgerSchema } from "./ledgerSchema";

const LedgerCollection = new Mongo.Collection("ledgers");

LedgerCollection.attachSchema(ledgerSchema);

export { LedgerCollection };
