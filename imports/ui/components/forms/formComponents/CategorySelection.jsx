import React from "react";

// Components
import { ExpenseLedgerSelection } from "./ExpenseLedgerSelection";
import { IncomeLedgerSelection } from "./IncomeLedgerSelection";
import { SavingsLedgerSelection } from "./SavingsLedgerSelection";

// Utils
import { cap } from "../../../util/cap";
import { UncategorizedLedgerSelection } from "./UncategorizedLedgerSelection";

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
        <div className="top-0 bg-app-bg-color flex flex-row justify-start items-center px-2 py-1 sticky z-50 shadow-sm h-8">
          <p className="font-semibold">{cap(section)}</p>
        </div>

        {ledgerList.map((ledger, i) => {
          const isBordered = i < ledgerList.length - 1;
          switch (envelopeType) {
            case "income":
              return (
                <IncomeLedgerSelection
                  ledger={ledger}
                  key={ledger._id}
                  selected={selectedLedgerIdList.includes(ledger._id)}
                  selectLedger={selectLedger}
                  deselectLedger={deselectLedger}
                  isBordered={isBordered}
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
                  isBordered={isBordered}
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
                  isBordered={isBordered}
                />
              );
            case "uncategorized":
              return (
                <UncategorizedLedgerSelection
                  ledger={ledger}
                  key={ledger._id}
                  selected={selectedLedgerIdList.includes(ledger._id)}
                  selectLedger={selectLedger}
                  deselectLedger={deselectLedger}
                  isBordered={isBordered}
                />
              );
          }
        })}
      </div>
    )
  );
}
