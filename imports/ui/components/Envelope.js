import React from "react";

// Utils
import { cap } from "../util/cap";
import { decimal } from "../util/decimal";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { Ledger } from "./Ledger";
import { reduceLedgers } from "../util/reduceLedgers";

export const Envelope = ({ name, startingBalance, ledgers, activeTab }) => {
  // If this envelope has an envelope that has a starting balance, then it is
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
    <div className="bg-white rounded-lg shadow-md flex flex-col items-stretch px-2 pt-1 gap-2 relative">
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
      <EnvelopeFooter displayBalance={displayBalance} />
    </div>
  );
};

function EnvelopeHeader({ name, activeTab }) {
  return (
    <div className="flex flex-row justify-between p-1 px-2 h-8 rounded-md overflow-hidden items-center">
      <h1 className="font-bold">{cap(name)}</h1>
      <h2 className="font-semibold">{cap(activeTab)}</h2>
    </div>
  );
}

function EnvelopeBody({ ledgers, activeTab }) {
  return (
    <div className="flex flex-col gap-2">
      {ledgers.map((ledger, i) => {
        return <Ledger key={i} {...ledger} activeTab={activeTab} />;
      })}
    </div>
  );
}

function EnvelopeFooter({ displayBalance }) {
  return (
    <div className="flex flex-row justify-between py-1">
      <p className="font-normal lg:hover:cursor-pointer">Add item</p>
      <h2 className="font-medium">{decimal(displayBalance)}</h2>
    </div>
  );
}

function EnvelopeProgress({ percent, overrideBgColor }) {
  const defaultBgColor = "bg-sky-500/30";
  const bgColor = overrideBgColor ? overrideBgColor : defaultBgColor;
  return (
    <div className="w-full top-0 bottom-0 absolute left-0 right-0 rounded-lg overflow-hidden">
      <div
        className={`${bgColor} h-full transition-width duration-300 ease-in-out delay-[10ms]`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}
