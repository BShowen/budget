import { Mongo } from "meteor/mongo";
import { tagSchema } from "./tagSchema";

const TagCollection = new Mongo.Collection("tags");

TagCollection.attachSchema(tagSchema);

export { TagCollection };
