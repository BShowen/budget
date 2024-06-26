import React from "react";

// Utils
import { cap } from "../../../util/cap";
import { toDollars } from "../../../util/toDollars";

// Icons
import { LuCheckCircle, LuCircle } from "react-icons/lu";

// Hooks
import { useIncomeLedger } from "../../../hooks/useIncomeLedger";

export function IncomeLedgerSelection({
  ledger,
  selected,
  selectLedger,
  deselectLedger,
  isBordered,
}) {
  const { leftToReceive } = useIncomeLedger({ ledgerId: ledger._id });
  return (
    <div
      onClick={
        selected
          ? () => deselectLedger({ ledger })
          : () => selectLedger({ ledger })
      }
      className={`w-full flex flex-row justify-start items-center min-h-12 ps-5 pe-3 lg:hover:cursor-pointer bg-dialog-ledger-selection-bg-color py-2 gap-1 ${
        isBordered && "border-b border-dialog-ledger-selection-border-color"
      }`}
    >
      <div
        className={`h-full min-w-fit max-w-fit flex flex-col justify-center items-start transition-all duration-200 ${
          selected ? "text-green-accent-0" : "text-gray-400"
        }`}
      >
        {selected ? (
          <LuCheckCircle className="w-5 h-5" />
        ) : (
          <LuCircle className="w-5 h-5" />
        )}
      </div>
      <div className="flex-col justify-start items-stretch">
        <div className="w-full flex flew-row justify-start items-center">
          <p
            className={`truncate w-full text-lg transition-all duration-200 ${
              selected && "text-green-accent-0"
            }`}
          >
            {cap(ledger.name)}
          </p>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-1">
          <p className="text-xs font-medium text-gray-400">
            {toDollars(leftToReceive)} left to receive
          </p>
        </div>
      </div>
    </div>
  );
}
