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
  createdAt: Date, // The date this budget was created
  income: {
    incomeExpected: Number, // Total income expected this month.
    incomeReceived: [Transaction], //Income received this month.
  },
  categories: [Category],
};

const Category = {
  name: String, // Name of this category. Groceries, Mortgage, Vehicles, etc.
  balance: Number, // The amount budgeted for this category.
  ledgers: [Ledger], //Can have multiple ledgers for any category.
};

const Ledger = {
  name: String, // Name of this ledger. Food, Utilities, Vehicle, etc.
  transactions: [Transaction],
};

const Transaction = {
  loggedBy: {
    userId: ID, // The userId of the person who logged this transaction.
    firstName: String,
    lastName: String,
  },
  createdAt: Date, // The date of this transaction.
  name: String, // Transaction name
  type: String, // Expense or Income
  amount: Number, // Dollar amount
};
