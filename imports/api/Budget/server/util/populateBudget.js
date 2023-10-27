import { TransactionCollection } from "../../../Transaction/TransactionCollection";
import { EnvelopeCollection } from "../../../Envelope/EnvelopCollection";
import { LedgerCollection } from "../../../Ledger/LedgerCollection";

// A simple function to populate all of the subfields in the Budget schema.
export function populateBudget(budget) {
  const budgetIncomeTransactions = TransactionCollection.find({
    _id: { $in: budget.income.received },
  }).fetch();

  const budgetEnvelopes = EnvelopeCollection.find({
    _id: { $in: budget.envelopes },
  }).fetch();

  budgetEnvelopes.forEach((envelope) => {
    // populate the envelope ledgers
    const populatedLedgers = LedgerCollection.find({
      _id: { $in: envelope.ledgers },
    }).fetch();
    envelope.ledgers = populatedLedgers;

    // populate the ledger transactions
    envelope.ledgers.forEach((ledger) => {
      const populatedLedgerTransactions = TransactionCollection.find({
        _id: { $in: ledger.transactions },
      }).fetch();
      ledger.transactions = populatedLedgerTransactions;
    });
  });

  budget.income.received = budgetIncomeTransactions;
  budget.envelopes = budgetEnvelopes;
  return budget;
}
