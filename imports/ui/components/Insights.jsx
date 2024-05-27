import React from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { toDollars } from "../util/toDollars";

export function Insights() {
  const anticipatedIncome = useTracker(() =>
    LedgerCollection.find(
      { kind: "income" },
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
      { kind: "income" },
      { fields: { _id: true } }
    );

    return TransactionCollection.find(
      { envelopeId: incomeEnvelope._id },
      { fields: { amount: true } }
    )
      .fetch()
      .reduce((acc, tx) => Math.round((acc + tx.amount) * 100) / 100, 0);
  });

  const spentSoFar = useTracker(() => {
    // Get all transactions that do not belong to incomeEnvelope or savingsEnvelope
    const [env1, env2] = EnvelopeCollection.find(
      { $or: [{ kind: "income" }, { kind: "savings" }] },
      { fields: { _id: true } }
    ).fetch();

    return TransactionCollection.find(
      {
        $and: [
          { envelopeId: { $not: env1._id } },
          { envelopeId: { $not: env2._id } },
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
    const allocationLedgers = LedgerCollection.find({ kind: "allocation" })
      .fetch()
      .map((ledger) => ledger._id);
    /* prettier-ignore */
    // Get all income transactions associated with the allocations
    const transactions = TransactionCollection.find({
      $and: [
        { ledgerId: { $in: allocationLedgers } },
        { type: "income" }
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
    const savingsLedgerIdList = LedgerCollection.find({ kind: "savings" })
      .fetch()
      ?.map((ledger) => ledger._id);
    /* prettier-ignore */
    // Get a list of all the transactions associated with the saving ledgers.
    const transactions = TransactionCollection.find({
      $and: [
        { ledgerId: { $in: savingsLedgerIdList } },
        { type: "income" }
      ],
    }).fetch();
    // Sum the total of all the transactions.
    const sum = transactions.reduce((acc, transaction) => {
      return Math.round((transaction.amount + acc) * 100) / 100;
    }, 0);
    return sum;
  });

  return (
    <div className="w-full flex flex-col justify-start items-stretch font-semibold gap-3">
      <div className="bg-insights-container-bg-color rounded-xl p-2 flex flex-col shadow-sm">
        <h1 className="text-lg font-bold">Income this month</h1>

        <div className="w-full flex flex-row gap-1 items-center px-2 justify-between text-insights-text-color">
          <p>Expected</p>
          <hr className="border-t border-dashed border-slate-400 grow mx-1" />
          <div>{toDollars(anticipatedIncome)}</div>
        </div>

        <div className="w-full flex flex-row gap-1 items-center px-2 text-insights-text-color">
          <p>Received</p>
          <hr className="border-t border-dashed border-slate-400 grow mx-1" />
          <div>{toDollars(incomeReceived)}</div>
        </div>
      </div>

      <div className="bg-insights-container-bg-color rounded-xl p-2 flex flex-col shadow-sm">
        <h1 className="text-lg font-bold">Saved this month</h1>

        <div className="w-full flex flex-row gap-1 items-center px-2 justify-between text-insights-text-color">
          <p>Savings</p>
          <hr className="border-t border-dashed border-slate-400 grow mx-1" />
          <div>{toDollars(savings)}</div>
        </div>
      </div>

      <div className="bg-insights-container-bg-color rounded-xl p-2 flex flex-col shadow-sm">
        <h1 className="text-lg font-bold">Spent this month</h1>
        <div className="w-full flex flex-row gap-1 items-center px-2 justify-between text-insights-text-color">
          <p>Spent</p>
          <hr className="border-t border-dashed border-slate-400 grow mx-1" />
          <div>{toDollars(spentSoFar)}</div>
        </div>
      </div>

      <div className="bg-insights-container-bg-color rounded-xl p-2 flex flex-col shadow-sm">
        <h1 className="text-lg font-bold">Remaining</h1>
        <div className="w-full flex flex-row gap-1 items-center px-2 justify-between text-insights-text-color">
          <p>Left to spend</p>
          <hr className="border-t border-dashed border-slate-400 grow mx-1" />
          <div>
            {toDollars(
              Math.round(
                (incomeReceived - spentSoFar - savings - allocations) * 100
              ) / 100
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
