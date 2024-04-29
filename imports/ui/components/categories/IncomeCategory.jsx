import React, { useState } from "react";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";

// Components
import { IncomeLedger } from "../ledgers/IncomeLedger";
import { NewLedgerForm } from "../forms/LedgerFormCreate";

// Icons
import { LuPlusCircle } from "react-icons/lu";

// Hooks
import { useIncomeCategory } from "../../hooks/useIncomeCategory";

export const IncomeCategory = ({ _id, name, activeTab }) => {
  const { incomeReceived, incomeExpected, incomeLeftToReceive, ledgerList } =
    useIncomeCategory({ envelopeId: _id });

  const displayBalance =
    activeTab === "spent"
      ? incomeReceived
      : activeTab === "remaining"
      ? incomeLeftToReceive
      : incomeExpected;

  return (
    // Envelope container
    <div className="envelope">
      <EnvelopeHeader
        name={name}
        activeTab={activeTab}
        envelopeId={_id}
        displayBalance={displayBalance}
      />
      <EnvelopeBody ledgers={ledgerList} activeTab={activeTab} />
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
      <NewLedgerForm
        toggleForm={toggleForm}
        envelopeId={envelopeId}
        placeholderText={"Income name"}
      >
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
              Add income source
            </p>
          </div>
        )}
      </NewLedgerForm>
    </div>
  );
}
