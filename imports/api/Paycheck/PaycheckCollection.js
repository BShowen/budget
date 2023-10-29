import { Mongo } from "meteor/mongo";
import { paycheckSchema } from "./paycheckSchema";

const PaycheckCollection = new Mongo.Collection("paychecks");

PaycheckCollection.attachSchema(paycheckSchema);

export { PaycheckCollection };
