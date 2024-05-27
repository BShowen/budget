import React from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../../../api/Ledger/LedgerCollection";

// Icons
import { IoIosRemove } from "react-icons/io";
import { LuCheckCircle, LuCircle } from "react-icons/lu";

// Utils
import { toDollars } from "../../../util/toDollars";
import { cap } from "../../../util/cap";

export function SelectedLedger({
  ledgerId,
  amount,
  deselectLedger,
  setLedgerAmount,
  isSplitTransaction,
}) {
  const ledger = useTracker(() => {
    if (ledgerId === "uncategorized") {
      return {
        name: "Uncategorized",
        _id: "uncategorized",
        envelopeId: "uncategorized",
        kind: "expense",
      };
    } else {
      return LedgerCollection.findOne({ _id: ledgerId });
    }
  });

  return (
    <div>
      <div className="w-full flex flex-col justify-start items-center transition-all duration-300 ease-in-out overflow-hidden h-10 opacity-100">
        <div className="w-full flex flex-row justify-start items-center h-10 gap-2 px-1">
          <IoIosRemove
            role="button"
            tabIndex={0}
            className="rounded-full w-5 h-5 text-white bg-rose-500 shrink-0"
            onClick={() => {
              deselectLedger({ ledger });
            }}
          />
          <p className="shrink-0">{cap(ledger.name)}</p>
          {isSplitTransaction && (
            <div className="h-full grow flex flex-row justify-end items-center">
              <input
                onFocus={(e) => e.target.setSelectionRange(0, 999)}
                type="text"
                inputMode="decimal"
                placeholder="$0.00"
                required
                name="splitAmount"
                value={toDollars(amount)}
                onInput={(e) => {
                  setLedgerAmount({
                    ledgerId,
                    amount: e.target.value
                      .split("$")
                      .join("")
                      .split(",")
                      .join(""),
                  });
                }}
                min={0}
                className="form-input border-none focus:ring-0 h-full text-right w-full bg-inherit"
              />
              <button
                type="button"
                className={`h-full flex flex-row justify-center items-center text-xl transition-colors duration-300 ease-in-out w-10 ${
                  amount > 0 ? "text-green-600" : "text-color-primary"
                }`}
              >
                {amount > 0 ? (
                  <LuCheckCircle className="w-5 h-5" />
                ) : (
                  <LuCircle className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
