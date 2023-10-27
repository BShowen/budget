import { Mongo } from "meteor/mongo";
import { budgetSchema } from "./budgetSchema";

// Collections
import { TransactionCollection } from "../Transaction/TransactionCollection";
import { EnvelopeCollection } from "../Envelope/EnvelopCollection";
import { LedgerCollection } from "../Ledger/LedgerCollection";

const BudgetCollection = new Mongo.Collection("budgets");

BudgetCollection.attachSchema(budgetSchema);

export { BudgetCollection };
