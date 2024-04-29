import React, { useState } from "react";
import { Link } from "react-router-dom";

// Utils
import { cap } from "../../util/cap";
import { toDollars } from "../../util/toDollars";

// Components
import { LedgerProgress } from "./ledgerComponents/LedgerProgress";
import { UpdateLedgerForm } from "../forms/LedgerFormUpdate";

// Hooks
import { useSavingsLedger } from "../../hooks/useSavingsLedger";

export const SavingsLedger = ({ ledger, activeTab }) => {
  const [isFormActive, setFormActive] = useState(false);
  const {
    _id: ledgerId,
    name,
    displayBalance,
    progressPercentage,
  } = useSavingsLedger({ ledgerId: ledger._id, activeTab });

  const activateForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormActive(true);
  };

  return (
    <div className="w-full h-8 relative px-2 py-1 bg-slate-100 rounded-lg lg:hover:cursor-pointer flex flex-row justify-between items-center">
      <LedgerProgress percent={progressPercentage} />
      {isFormActive ? (
        <>
          <UpdateLedgerForm
            toggleForm={() => setFormActive(false)}
            ledger={ledger}
          />
        </>
      ) : (
        <Link
          to={`/ledger/${ledgerId}/transactions`}
          className="w-full h-full p-0 m-0 flex flex-row justify-between items-center z-10"
        >
          <h2 className="font-semibold z-20">{cap(name)}</h2>
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
