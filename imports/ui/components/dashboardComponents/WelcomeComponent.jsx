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

export function WelcomeComponent({ budgetTimestamp, budgetId }) {
  const isFutureBudget =
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() <
    budgetTimestamp;

  const firstName = cap(Meteor.user().profile.firstName);

  const anticipatedIncome = useTracker(() =>
    LedgerCollection.find(
      { kind: "income", budgetId },
      { fields: { allocatedAmount: true } }
    )
      .fetch()
      .reduce(
        (acc, ledger) => Math.round((acc + ledger.allocatedAmount) * 100) / 100,
        0
      )
  );
  const incomeReceived = useTracker(() => {
    // Get all transactions that belong to the income envelope and accumulate
    // their totals into a single dollar amount.
    const incomeEnvelope = EnvelopeCollection.findOne(
      { kind: "income", budgetId },
      { fields: { _id: true } }
    );

    return TransactionCollection.find(
      { envelopeId: incomeEnvelope._id, budgetId },
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
        $and: [
          { envelopeId: { $not: env1._id }, budgetId },
          { envelopeId: { $not: env2._id }, budgetId },
        ],
      },
      { fields: { amount: true, type: true } }
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

  // This is the sum of all the income transactions in allocation ledgers.
  const allocations = useTracker(() => {
    // An array of all allocation ledger id's.
    const allocationLedgers = LedgerCollection.find({
      kind: "allocation",
      budgetId,
    })
      .fetch()
      .map((ledger) => ledger._id);
    /* prettier-ignore */
    // Get all income transactions associated with the allocations
    const transactions = TransactionCollection.find({
      $and: [
        { ledgerId: { $in: allocationLedgers } },
        { type: "income" }, 
        { budgetId }
      ],
    }).fetch();
    // Sum the transaction totals.
    const sum = transactions.reduce((acc, transaction) => {
      return Math.round((acc + transaction.amount) * 100) / 100;
    }, 0);
    return sum;
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
    /* prettier-ignore */
    // Get a list of all the transactions associated with the saving ledgers.
    const transactions = TransactionCollection.find({
      $and: [
        { ledgerId: { $in: savingsLedgerIdList } },
        { type: "income" },
        { budgetId }
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

  const leftToBudget =
    Math.round((anticipatedIncome - totalIncomeBudgeted) * 100) / 100;

  return (
    <div className="text-color-light-gray font-semibold">
      {isFutureBudget && <FutureBudgetWarning />}
      <p className="text-2xl">Hi {firstName}</p>
      {leftToBudget > 0 && (
        <p>You still have {toDollars(leftToBudget)} left to budget 💰</p>
      )}

      {leftToBudget < 0 && (
        <div className="text-red-500 border border-red-500 rounded-xl px-2 py-1 bg-red-500/5 shadow-sm flex flex-row justify-start items-center">
          <LuAlertCircle className="text-lg" />
          <p>You are over budget by {toDollars(Math.abs(leftToBudget))}</p>
        </div>
      )}

      {leftToBudget == 0 && <p>You've budgeted all your income! 🎉</p>}

      <p>
        {`You currently have ${toDollars(
          Math.round(
            (incomeReceived - spentSoFar - allocations - savings) * 100
          ) / 100
        )} available to spend on your budget 💵`}
      </p>
    </div>
  );
}

function FutureBudgetWarning() {
  return (
    <div className="text-red-500 border border-red-500 rounded-full px-2 py-1 bg-red-500/5 shadow-sm flex flex-row justify-start items-center gap-2">
      <LuAlertCircle className="text-lg" />
      <p>You're viewing a future budget.</p>
    </div>
  );
}
