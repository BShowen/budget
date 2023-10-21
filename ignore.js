const User = {
  firstName: String,
  lastName: String,
  emailAddress: String,
  accountId: ID, // Id of the account this user belongs to.
};

const Account = {
  budgetList: [Budget], // Array fo monthly budgets
};

const Budget = {
  userId: ID, // The user id of a user
  month: String,
  year: Number,
  income: {
    incomeExpected: Number, // Total income expected this month.
    incomeReceived: [Transaction], //Income received this month.
  },
  budgetCategories: [Category],
};

const Category = {
  name: String, // Name of this category. Groceries, Mortgage, Vehicles, etc.
  amount: Number, // The amount budgeted for this category.
  ledgers: [Ledger], //Can have multiple ledgers for any category.
};

const Ledger = {
  name: String, // Name of this ledger. Food, Utilities, Vehicle, etc.
  transactions: [Transaction],
};

const Transaction = {
  loggedBy: ID, // The userId of the person who logged this transaction.
  date: Date, // The date of this transaction.
  name: String, // Transaction name
  type: String, // Expense or Income
  amount: String, // Dollar amount
};
