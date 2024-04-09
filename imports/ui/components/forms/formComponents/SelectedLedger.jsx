import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../../../api/Ledger/LedgerCollection";

// Icons
import { IoIosRemove } from "react-icons/io";
import { FaLock, FaLockOpen } from "react-icons/fa";

// Utils
import { toDollars } from "../../../util/toDollars";
import { cap } from "../../../util/cap";

export function SelectedLedger({
  ledgerId,
  deselectLedger,
  willUnmount,
  splitAmount,
  isLocked,
  toggleLocked,
  updateSplitAmount,
  splitAmountRequired,
}) {
  const ledger = useTracker(() => {
    return (
      LedgerCollection.findOne({ _id: ledgerId }) || {
        name: "Uncategorized",
        _id: "uncategorized",
        envelopeId: "uncategorized",
        kind: "expense",
      }
    );
  });
  const [deselecting, setDeselecting] = useState(false);

  return (
    <div>
      <div
        className={`w-full flex flex-col justify-start items-center transition-all duration-300 ease-in-out overflow-hidden ${
          deselecting || willUnmount ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
      >
        <div className="w-full flex flex-row justify-start items-center h-10 gap-2 px-1">
          <IoIosRemove
            role="button"
            tabIndex={0}
            className="rounded-full w-6 h-6 text-white bg-rose-500 shrink-0"
            onClick={() => {
              setDeselecting(true);
              setTimeout(() => {
                deselectLedger({ ledgerId });
              }, 310);
            }}
          />
          <p className="font-semibold text-lg shrink-0">{cap(ledger.name)}</p>
          {splitAmountRequired && (
            <div className="h-full grow flex flex-row justify-end items-center">
              <input
                onFocus={(e) => e.target.setSelectionRange(0, 999)}
                type="text"
                inputMode="decimal"
                placeholder="$0.00"
                required
                name="splitAmount"
                value={toDollars(splitAmount)}
                onInput={(e) => {
                  updateSplitAmount({
                    ledgerId,
                    amount: e.target.value
                      .split("$")
                      .join("")
                      .split(",")
                      .join(""),
                  });
                }}
                min={0}
                className="font-semibold form-input border-none focus:ring-0 h-full text-right w-full"
              />
              <button
                type="button"
                onClick={toggleLocked}
                className={`h-full flex flex-row justify-center items-center text-xl transition-colors duration-300 ease-in-out ${
                  isLocked ? "text-green-600" : "text-color-primary"
                }`}
              >
                {isLocked ? <FaLock /> : <FaLockOpen />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
