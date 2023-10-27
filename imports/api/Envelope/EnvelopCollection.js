import { Mongo } from "meteor/mongo";
import { envelopeSchema } from "./envelopeSchema";

const EnvelopeCollection = new Mongo.Collection("envelopes");

EnvelopeCollection.attachSchema(envelopeSchema);

export { EnvelopeCollection };
