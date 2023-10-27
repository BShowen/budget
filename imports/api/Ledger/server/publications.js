import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "../LedgerCollection";
import { TransactionCollection } from "../../Transaction/TransactionCollection";

// Return all ledgers associated with a Budget
Meteor.publish("ledgers", function () {
  if (!this.userId) {
    return [];
  }
  return LedgerCollection.find();

  const ledger = LedgerCollection.findOne({ _id: ledgerId });
  // Populate the ledger.transactions field
  const populatedLedgerTransactions = TransactionCollection.find({
    _id: { $in: ledger.transactions },
  }).fetch();
  ledger.transactions = populatedLedgerTransactions;

  this.added("ledgers", ledger._id, ledger);
  this.ready();
});
