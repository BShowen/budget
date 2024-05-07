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
  const { displayBalance, progressPercentage, name } = useIncomeLedger({
    ledgerId: ledger._id,
    activeTab,
  });

  const activateForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormActive(true);
  };

  return (
    <div className="w-full h-7 relative z-0 px-2 py-1 bg-slate-100 rounded-lg lg:hover:cursor-pointer flex flex-row justify-between items-center">
      <LedgerProgress percent={progressPercentage} />
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
          <h2 className="z-20">{cap(name)}</h2>
          <h2
            onClick={activateForm}
            className={`z-20 ${displayBalance < 0 ? "text-rose-500" : ""}`}
          >
            {toDollars(displayBalance)}
          </h2>
        </Link>
      )}
    </div>
  );
};
