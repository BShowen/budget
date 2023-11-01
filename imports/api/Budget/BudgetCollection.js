import { Mongo } from "meteor/mongo";
import { budgetSchema } from "./budgetSchema";

const BudgetCollection = new Mongo.Collection("budgets");

BudgetCollection.attachSchema(budgetSchema);

export { BudgetCollection };
