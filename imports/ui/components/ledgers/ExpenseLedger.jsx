import React, { useState } from "react";
import { Link } from "react-router-dom";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";

// Components
import { LedgerProgress } from "./ledgerComponents/LedgerProgress";
import { UpdateLedgerForm } from "../forms/LedgerFormUpdate";

// Collections

// Hooks
import { useExpenseLedger } from "../../hooks/useExpenseLedger";

export const ExpenseLedger = ({ ledger, activeTab }) => {
  const [isFormActive, setFormActive] = useState(false);
  const {
    moneySpent,
    percentSpent,
    percentRemaining,
    leftToSpend,
    allocatedAmount,
    name,
    _id: ledgerId,
  } = useExpenseLedger({ ledgerId: ledger._id });

  const tabBalance = (() => {
    switch (activeTab) {
      case "planned":
        return allocatedAmount;
      case "spent":
        return moneySpent;
      case "remaining":
        return leftToSpend;
    }
  })();

  const progress = (() => {
    switch (activeTab) {
      case "planned":
        return 0;
      case "spent":
        return percentSpent;
      case "remaining":
        return percentRemaining;
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
          to={`/ledger/${ledgerId}/transactions`}
          className="w-full h-full p-0 m-0 flex flex-row justify-between items-center z-10"
        >
          <h2 className="font-semibold z-20">{cap(name)}</h2>
          <h2
            onClick={activateForm}
            className={`font-bold z-20 ${
              activeTab == "planned" ? "" : leftToSpend < 0 && "text-rose-500"
            }`}
          >
            {toDollars(tabBalance)}
          </h2>
        </Link>
      )}
    </div>
  );
};
