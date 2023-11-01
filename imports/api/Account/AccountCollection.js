import { Mongo } from "meteor/mongo";
import { accountSchema } from "./accountSchema";

const AccountCollection = new Mongo.Collection("accounts");

AccountCollection.attachSchema(accountSchema);

export { AccountCollection };
