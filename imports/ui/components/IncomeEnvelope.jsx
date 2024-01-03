import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { reduceTransactions } from "../util/reduceTransactions";

// Components
import { IncomeLedger } from "./IncomeLedger";
import { NewLedgerForm } from "./NewLedgerForm";

// Icons
import { LuPlusCircle } from "react-icons/lu";

export const IncomeEnvelope = ({ _id, name, activeTab }) => {
  const { ledgers } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Return the ledgers that belong to this envelope
    const ledgers = LedgerCollection.find({
      envelopeId: _id,
    }).fetch();
    return { ledgers };
  });

  const { transactions } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Return the transactions that are in this envelope
    const transactions = TransactionCollection.find({
      envelopeId: _id,
    }).fetch();
    return { transactions };
  });
  const totalIncomeExpected = ledgers.reduce((total, ledger) => {
    return total + ledger.allocatedAmount;
  }, 0);

  const { income: totalIncomeReceived } = reduceTransactions({ transactions });

  const remainingToReceive = totalIncomeExpected - totalIncomeReceived;
  const displayBalance =
    activeTab === "spent"
      ? totalIncomeReceived
      : activeTab === "remaining"
      ? remainingToReceive
      : totalIncomeExpected;

  return (
    // Envelope container
    <div className="envelope">
      <EnvelopeHeader
        name={name}
        activeTab={activeTab}
        envelopeId={_id}
        displayBalance={displayBalance}
      />
      <EnvelopeBody ledgers={ledgers} activeTab={activeTab} />
      <EnvelopeFooter envelopeId={_id} />
    </div>
  );
};

function EnvelopeHeader({ name, activeTab, displayBalance }) {
  let categoryName = "";
  switch (activeTab) {
    case "planned":
      categoryName = "planned";
      break;
    case "spent":
      categoryName = "income received";
      break;
    case "remaining":
      categoryName = "left to receive";
      break;
  }
  // const categoryName =
  //   activeTab === "planned"
  //     ? activeTab
  //     : activeTab == "spent"
  //     ? "income received"
  //     : "left to receive";
  return (
    <div className="envelope-header">
      <h1 className="relative z-50">{cap(name)}</h1>
      <div className="flex flex-row justify-center items-center gap-1">
        <h2 className="font-semibold text-sm relative z-50 text-color-dark-blue">
          {cap(categoryName)}
        </h2>
        <h2 className="text-sm font-semibold">{toDollars(displayBalance)}</h2>
      </div>
    </div>
  );
}

function EnvelopeBody({ ledgers, activeTab }) {
  return (
    <div className="envelope-body">
      {ledgers.map((ledger) => (
        <IncomeLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
    </div>
  );
}

function EnvelopeFooter({ envelopeId }) {
  const [isFormActive, setFormActive] = useState(false);
  const toggleForm = () => {
    setFormActive((prev) => !prev);
  };

  return (
    <div className="envelope-footer">
      <NewLedgerForm toggleForm={toggleForm} envelopeId={envelopeId}>
        {!isFormActive && (
          <div className="w-full flex flex-row justify-start items-center gap-1">
            <LuPlusCircle className="text-lg" />
            <p
              onClick={() => {
                if (!isFormActive) {
                  toggleForm();
                }
              }}
              className="font-semibold text-sm lg:hover:cursor-pointer"
            >
              Add income
            </p>
          </div>
        )}
      </NewLedgerForm>
    </div>
  );
}
