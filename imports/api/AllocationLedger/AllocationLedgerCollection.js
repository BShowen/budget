import { Mongo } from "meteor/mongo";
import { allocationLedgerSchema } from "./allocationLedgerSchema";

const AllocationLedgerCollection = new Mongo.Collection("allocationLedgers");

AllocationLedgerCollection.attachSchema(allocationLedgerSchema);

export { AllocationLedgerCollection };
