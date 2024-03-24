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
    <div className="w-full flex flex-col justify-start items-stretch font-semibold gap-2">
      <div className="bg-white rounded-xl p-2 flex flex-col gap-1">
        <h1 className="text-lg font-bold">Income</h1>

        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Expected</div>
          <div>{toDollars(anticipatedIncome)}</div>
        </div>

        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Received</div>
          <div>{toDollars(incomeReceived)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 flex flex-col gap-1">
        <h1 className="text-lg font-bold ">Saved</h1>

        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Savings</div>
          <div>{toDollars(Math.round(savings * 100) / 100)}</div>
        </div>

        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Allocations</div>
          <div>{toDollars(Math.round(allocations * 100) / 100)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 flex flex-col gap-1">
        <h1 className="text-xl font-bold ">Spent</h1>
        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Spent this month</div>
          <div>{toDollars(spentSoFar)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 flex flex-col gap-1">
        <h1 className="text-xl font-bold ">Remaining</h1>
        <div className="w-full flex flex-row justify-between bg-slate-100 rounded-md px-2">
          <div>Left to spend</div>
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
