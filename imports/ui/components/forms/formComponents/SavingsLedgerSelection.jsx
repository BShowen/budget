import React from "react";

// Utils
import { cap } from "../../../util/cap";
import { toDollars } from "../../../util/toDollars";

// Icons
import { LuCheckCircle, LuCircle } from "react-icons/lu";

// Hooks
import { useSavingsLedger } from "../../../hooks/useSavingsLedger";

export function SavingsLedgerSelection({
  ledger,
  selected,
  selectLedger,
  deselectLedger,
}) {
  const { leftToSave } = useSavingsLedger({ ledgerId: ledger._id });
  return (
    <div
      onClick={
        selected
          ? () => deselectLedger({ ledger })
          : () => selectLedger({ ledger })
      }
      className={`lg:hover:cursor-pointer w-full rounded-xl overflow-hidden px-2 min-h-16 flex flex-row justify-between items-center border transition-all duration-200 mb-2 ${
        selected
          ? "border-green-500 bg-green-100/30"
          : "border-transparent bg-white"
      }`}
    >
      <div className="flex-col justify-start items-stretch">
        <div className="w-full flex flew-row justify-start items-center">
          <p className="font-semibold text-lg">{cap(ledger.name)}</p>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-1">
          <p>{toDollars(leftToSave)} left to save</p>
        </div>
      </div>
      <div
        className={`h-full w-10 flex flex-col justify-center items-start transition-all duration-200 ${
          selected ? "text-green-600" : "text-color-light-gray"
        }`}
      >
        {selected ? (
          <LuCheckCircle className="w-7 h-7" />
        ) : (
          <LuCircle className="w-7 h-7" />
        )}
      </div>
    </div>
  );
}
