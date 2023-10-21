import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
const Budgets = new Mongo.Collection("budgets");

const TransactionSchema = new SimpleSchema({
  loggedBy: Object,
  "loggedBy.userId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  "loggedBy.firstName": String,
  "loggedBy.lastName": String,
  createdAt: Date,
  name: String,
  type: {
    type: String,
    allowedValues: ["income", "expense"],
  },
  amount: {
    type: Number,
    min: 0,
  },
});

const LedgerSchema = new SimpleSchema({
  name: String,
  startingBalance: {
    type: Number,
    optional: true,
  },
  transactions: { type: Array, optional: true },
  "transactions.$": TransactionSchema,
});

const CategorySchema = new SimpleSchema({
  name: String,
  startingBalance: Number,
  ledgers: { type: Array, optional: true },
  "ledgers.$": LedgerSchema,
});

const BudgetSchema = new SimpleSchema({
  createdAt: Date,
  income: Object,
  "income.expected": Number,
  "income.received": { type: Array, optional: true },
  "income.received.$": TransactionSchema,
  categories: { type: Array, optional: true },
  "categories.$": CategorySchema,
});

Budgets.attachSchema(BudgetSchema);
export { Budgets as BudgetCollection };
