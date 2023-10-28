import React from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { cap } from "../util/cap";
import { decimal } from "../util/decimal";
import { reduceLedgers } from "../util/reduceLedgers";

// Components
import { Ledger } from "./Ledger";

export const Envelope = ({
  _id,
  name,
  startingBalance,
  activeTab,
  addItemHandler,
}) => {
  const { ledgers } = useTracker(() => {
    if (!Meteor.userId()) {
      return {};
    }
    // Get the envelope that contains the transactions for this component.
    const envelope = EnvelopeCollection.findOne({ _id });
    // Get the ledgers in the envelope
    const ledgers = LedgerCollection.find({
      _id: { $in: envelope.ledgers },
    }).fetch();
    // Populate the ledger.transactions field so balances can be calculated in
    // this component.
    ledgers.forEach((ledger) => {
      const populatedTransactions = TransactionCollection.find({
        _id: { $in: ledger.transactions },
      }).fetch();
      ledger.transactions = populatedTransactions;
    });

    return { ledgers };
  });
  // If this envelope has a ledger that has a starting balance, then it is
  // an allocatedEnvelope. Otherwise it is an unallocatedEnvelope
  const envelopeType = (ledgers || []).some((ledger) => ledger.startingBalance)
    ? "allocated"
    : "unallocated";

  const { expense, income } = reduceLedgers({ ledgers });
  const spent = expense - income;

  const remaining = startingBalance - spent;
  const displayBalance =
    activeTab === "spent"
      ? spent
      : activeTab === "remaining"
      ? remaining
      : startingBalance;

  const progress =
    activeTab === "spent"
      ? (spent / startingBalance) * 100
      : activeTab === "remaining"
      ? (remaining / startingBalance) * 100
      : 0;

  return (
    // Envelope container
    <div className="bg-white rounded-lg shadow-md flex flex-col items-stretch px-2 pt-1 gap-2 relative z-0">
      {envelopeType === "unallocated" ? (
        <EnvelopeProgress percent={progress} />
      ) : (
        ""
      )}
      <EnvelopeHeader
        name={name}
        activeTab={activeTab}
        progress={progress}
        envelopeType={envelopeType}
      />
      <EnvelopeBody
        ledgers={ledgers}
        activeTab={activeTab}
        progress={progress}
      />
      <EnvelopeFooter
        displayBalance={displayBalance}
        addItemHandler={addItemHandler}
      />
    </div>
  );
};

function EnvelopeHeader({ name, activeTab }) {
  return (
    <div className="flex flex-row justify-between p-1 px-2 h-8 rounded-md overflow-hidden items-center z-20">
      <h1 className="font-bold">{cap(name)}</h1>
      <h2 className="font-semibold">{cap(activeTab)}</h2>
    </div>
  );
}

function EnvelopeBody({ ledgers, activeTab }) {
  return (
    <div className="flex flex-col gap-2 z-20">
      {ledgers.map((ledger, i) => {
        return <Ledger key={i} {...ledger} activeTab={activeTab} />;
      })}
    </div>
  );
}

function EnvelopeFooter({ displayBalance, addItemHandler }) {
  return (
    <div className="flex flex-row justify-between py-1 z-20">
      <p
        className="font-normal lg:hover:cursor-pointer"
        onClick={addItemHandler}
      >
        Add item
      </p>
      <h2 className="font-medium">{decimal(displayBalance)}</h2>
    </div>
  );
}

function EnvelopeProgress({ percent, overrideBgColor }) {
  const defaultBgColor = "bg-sky-500/30";
  const bgColor = overrideBgColor ? overrideBgColor : defaultBgColor;
  return (
    <div className="w-full top-0 bottom-0 absolute left-0 right-0 rounded-lg overflow-hidden z-10">
      <div
        className={`${bgColor} h-full transition-width duration-300 ease-in-out delay-[10ms]`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}
