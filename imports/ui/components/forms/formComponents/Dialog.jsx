import React from "react";

// Components
import { LedgerSelectionSectionList } from "./LedgerSelectionList";

export function Dialog({
  closeDialog,
  isOpen,
  ledgerList,
  selectedLedgerIdList,
  selectLedger,
  deselectLedger,
  transactionType,
}) {
  const {
    income: incomeLedgers,
    expense: expenseLedgers,
    savings: savingsLedgers,
    allocation: allocationLedgers,
  } = ledgerList;

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 w-full lg:w-3/5 mx-auto p-0 transition-all duration-300 z-50 bg-white/5 overflow-hidden padding-safe-area-top flex flex-col justify-start ${
        isOpen
          ? "backdrop-blur-sm delay-0"
          : "backdrop-blur-none invisible delay-150"
      }`}
    >
      <div
        className={`bg-app w-full h-full overflow-hidden padding-safe-area-bottom transition-all duration-300 ease-in-out flex flex-col justify-start items-stretch ${
          isOpen ? "translate-y-0 delay-[25ms]" : "translate-y-full delay-0"
        }`}
      >
        <div className="bg-header w-full flex flex-row justify-center items-center py-2 font-bold min-h-10">
          <h1 className="text-xl text-white">Categories</h1>
          <button
            //Prevent this button from submitting the underlying form
            type="button"
            className="absolute right-5 text-white"
            onClick={closeDialog}
          >
            Done
          </button>
        </div>
        <div
          // This click handler prevents a scroll bug in Safari PWA mode.
          // This click handler prevents the parent DOM nodes from receiving focus.
          onClick={(e) => e.stopPropagation()}
          className="max-h-full overflow-scroll flex flex-col justify-start items-center overscroll-auto scrollbar-hide z-50"
        >
          <LedgerSelectionSectionList
            section={"Income"}
            ledgerList={incomeLedgers}
            selectedLedgerIdList={selectedLedgerIdList}
            selectLedger={selectLedger}
            deselectLedger={deselectLedger}
            transactionType={transactionType}
          />

          <LedgerSelectionSectionList
            section={"Savings"}
            ledgerList={savingsLedgers}
            selectedLedgerIdList={selectedLedgerIdList}
            selectLedger={selectLedger}
            deselectLedger={deselectLedger}
            transactionType={transactionType}
          />

          <LedgerSelectionSectionList
            section={"Allocation"}
            ledgerList={allocationLedgers}
            selectedLedgerIdList={selectedLedgerIdList}
            selectLedger={selectLedger}
            deselectLedger={deselectLedger}
            transactionType={transactionType}
          />

          <LedgerSelectionSectionList
            section={"Expense"}
            ledgerList={expenseLedgers}
            selectedLedgerIdList={selectedLedgerIdList}
            selectLedger={selectLedger}
            deselectLedger={deselectLedger}
            transactionType={transactionType}
          />
        </div>
      </div>
    </div>
  );
}
