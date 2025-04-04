import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

import { EnvelopeCollection } from "../../../api/Envelope/EnvelopeCollection";
import { TransactionCollection } from "../../../api/Transaction/TransactionCollection";
import { LedgerCollection } from "../../../api/Ledger/LedgerCollection";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";

// Icons
import { LuAlertCircle } from "react-icons/lu";

export function WelcomeComponent({ budgetId }) {
  const firstName = cap(Meteor.user().profile.firstName);

  const anticipatedIncome = useTracker(() =>
    LedgerCollection.find(
      {
        kind: "income",
        budgetId,
      },
      { fields: { allocatedAmount: true } }
    )
      .fetch()
      .reduce((acc, ledger) => Math.round((acc + ledger.allocatedAmount) * 100) / 100, 0)
  );

  const incomeReceived = useTracker(() => {
    // Get all transactions that belong to the income envelope and accumulate
    // their totals into a single dollar amount.
    const incomeEnvelope = EnvelopeCollection.findOne(
      {
        kind: "income",
        budgetId,
      },
      { fields: { _id: true } }
    );

    return TransactionCollection.find(
      {
        allocations: { $elemMatch: { envelopeId: incomeEnvelope._id } },
        budgetId,
      },
      { fields: { amount: true } }
    )
      .fetch()
      .reduce((acc, tx) => Math.round((acc + tx.amount) * 100) / 100, 0);
  });

  const spentSoFar = useTracker(() => {
    // Get all transactions that do not belong to incomeEnvelope or savingsEnvelope
    const [env1, env2] = EnvelopeCollection.find(
      {
        $or: [
          { kind: "income", budgetId },
          { kind: "savings", budgetId },
        ],
      },
      { fields: { _id: true } }
    ).fetch();

    return TransactionCollection.find(
      {
        budgetId: budgetId,
        allocations: {
          $elemMatch: {
            $and: [{ envelopeId: { $ne: env1._id } }, { envelopeId: { $ne: env2._id } }],
          },
        },
      },
      { fields: { amount: true, type: true, merchant: true } }
    )
      .fetch()
      .reduce((acc, tx) => {
        if (tx.type == "expense") {
          return Math.round((acc + tx.amount) * 100) / 100;
        } else {
          return Math.round((acc - tx.amount) * 100) / 100;
        }
      }, 0);
  });

  // This is the sum of all the income transactions in the savings ledgers.
  const savings = useTracker(() => {
    // An array of all savings ledger id's
    const savingsLedgerIdList = LedgerCollection.find({
      kind: "savings",
      budgetId,
    })
      .fetch()
      ?.map((ledger) => ledger._id);
    // Get a list of all the transactions associated with the saving ledgers.
    const transactions = TransactionCollection.find({
      allocations: {
        $elemMatch: {
          ledgerId: { $in: savingsLedgerIdList },
        },
      },
      $and: [
        // { ledgerId: { $in: savingsLedgerIdList } },
        { type: "income" },
        { budgetId },
      ],
    }).fetch();
    // Sum the total of all the transactions.
    const sum = transactions.reduce((acc, transaction) => {
      return Math.round((transaction.amount + acc) * 100) / 100;
    }, 0);
    return sum;
  });

  const totalIncomeBudgeted = useTracker(() => {
    const ledgers = LedgerCollection.find({
      kind: { $ne: "income" },
      budgetId,
    }).fetch();
    return ledgers.reduce((total, ledger) => {
      return Math.round((ledger.allocatedAmount + total) * 100) / 100;
    }, 0);
  });

  const leftToBudget = Math.round((anticipatedIncome - totalIncomeBudgeted) * 100) / 100;

  return (
    <div className="text-color-light-gray font-medium">
      <div className="px-2 flex flex-col gap-1">
        <p className="text-2xl">{firstName},</p>
        <p>{`You have ${toDollars(Math.round((incomeReceived - spentSoFar) * 100) / 100)} in your bank.`}</p>
        {leftToBudget > 0 && <p>You still have {toDollars(leftToBudget)} left to budget.</p>}

        {leftToBudget < 0 && (
          <div className="text-red-500 border border-red-500 rounded-xl px-2 py-1 bg-red-500/5 shadow-sm flex flex-row justify-start items-center">
            <LuAlertCircle className="text-lg" />
            <p>You are over budget by {toDollars(Math.abs(leftToBudget))}</p>
          </div>
        )}

        {leftToBudget == 0 && <p>You've budgeted all your income.</p>}
      </div>
    </div>
  );
}
