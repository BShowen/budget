import React from "react";

// Components
import { LedgerSelection } from "./LedgerSelection";

export function LedgerSelectionSectionList({
  section,
  ledgerList,
  selectedLedgerIdList,
  selectLedger,
  deselectLedger,
  transactionType,
}) {
  // If the user is creating an expense, don't show any income ledgers in the
  // ledger selection. Income ledgers cannot have expense transactions.
  if (
    ledgerList.length > 0 &&
    ledgerList[0].kind == "income" &&
    transactionType == "expense"
  ) {
    return "";
  }
  return (
    ledgerList.length > 0 && (
      <div className="w-full flex flex-col justify-start">
        <div className="max-w-full h-7 sticky top-0 bg-blue-900 text-center px-2">
          <p className="font-semibold text-white text-xl">{section}</p>
        </div>
        <div className="w-full h-full pt-2 px-2">
          {ledgerList.map((ledger) => {
            return (
              <LedgerSelection
                ledger={ledger}
                key={ledger._id}
                selected={selectedLedgerIdList.includes(ledger._id)}
                selectLedger={selectLedger}
                deselectLedger={deselectLedger}
                transactionType={transactionType}
              />
            );
          })}
        </div>
      </div>
    )
  );
}
