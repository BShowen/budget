import React, { useState } from "react";
import { Link } from "react-router-dom";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";

// Components
import { LedgerProgress } from "./ledgerComponents/LedgerProgress";
import { UpdateLedgerForm } from "../forms/LedgerFormUpdate";

// Hooks
import { useIncomeLedger } from "../../hooks/useIncomeLedger";

export const IncomeLedger = ({ ledger, activeTab }) => {
  const [isFormActive, setFormActive] = useState(false);
  const { incomeReceived, leftToReceive, percentIncomeReceived } =
    useIncomeLedger({ ledgerId: ledger._id });

  const displayBalance = (() => {
    switch (activeTab) {
      case "planned":
        return Math.round(ledger.allocatedAmount * 100) / 100;
      case "spent":
        return incomeReceived;
      case "remaining":
        return ledger.allocatedAmount > 0 ? leftToReceive : 0;
    }
  })();

  const progress = (() => {
    if (activeTab === "planned") {
      return 0;
    } else if (activeTab === "spent") {
      return ledger.allocatedAmount
        ? Math.round((incomeReceived / ledger.allocatedAmount) * 100)
        : 0;
    } else if (activeTab === "remaining") {
      return percentIncomeReceived;
    }
  })();

  const activateForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormActive(true);
  };

  return (
    <div className="w-full h-8 relative z-0 px-2 py-1 bg-slate-100 rounded-lg lg:hover:cursor-pointer flex flex-row justify-between items-center">
      <LedgerProgress percent={progress} />
      {isFormActive ? (
        <UpdateLedgerForm
          toggleForm={() => setFormActive(false)}
          ledger={ledger}
        />
      ) : (
        <Link
          to={`/ledger/${ledger._id}/transactions`}
          className="w-full h-full p-0 m-0 flex flex-row justify-between items-center z-10"
        >
          <h2 className="font-semibold z-20">{cap(ledger.name)}</h2>
          <h2
            onClick={activateForm}
            className={`font-bold z-20 ${
              displayBalance < 0 ? "text-rose-500" : ""
            }`}
          >
            {toDollars(displayBalance)}
          </h2>
        </Link>
      )}
    </div>
  );
};
