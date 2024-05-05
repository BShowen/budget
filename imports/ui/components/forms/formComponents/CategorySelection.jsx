import React from "react";

// Components
import { ExpenseLedgerSelection } from "./ExpenseLedgerSelection";
import { IncomeLedgerSelection } from "./IncomeLedgerSelection";
import { SavingsLedgerSelection } from "./SavingsLedgerSelection";

// Utils
import { cap } from "../../../util/cap";

export function CategorySelection({
  section,
  envelopeType,
  ledgerList,
  selectedLedgerIdList,
  selectLedger,
  deselectLedger,
}) {
  return (
    ledgerList.length > 0 && (
      <div className="w-full flex flex-col justify-start">
        <div className="max-w-full h-7 sticky top-0 bg-blue-900 text-center px-2">
          <p className="font-semibold text-white text-xl">{cap(section)}</p>
        </div>
        <div className="w-full h-full pt-2 px-2">
          {ledgerList.map((ledger) => {
            switch (envelopeType) {
              case "income":
                return (
                  <IncomeLedgerSelection
                    ledger={ledger}
                    key={ledger._id}
                    selected={selectedLedgerIdList.includes(ledger._id)}
                    selectLedger={selectLedger}
                    deselectLedger={deselectLedger}
                  />
                );
              case "expense":
                return (
                  <ExpenseLedgerSelection
                    ledger={ledger}
                    key={ledger._id}
                    selected={selectedLedgerIdList.includes(ledger._id)}
                    selectLedger={selectLedger}
                    deselectLedger={deselectLedger}
                  />
                );
              case "savings":
                return (
                  <SavingsLedgerSelection
                    ledger={ledger}
                    key={ledger._id}
                    selected={selectedLedgerIdList.includes(ledger._id)}
                    selectLedger={selectLedger}
                    deselectLedger={deselectLedger}
                  />
                );
            }
          })}
        </div>
      </div>
    )
  );
}
