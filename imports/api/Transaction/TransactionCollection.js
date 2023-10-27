import { Mongo } from "meteor/mongo";
import { transactionSchema } from "./transactionSchema";

const TransactionCollection = new Mongo.Collection("transactions");

TransactionCollection.attachSchema(transactionSchema);

export { TransactionCollection };
