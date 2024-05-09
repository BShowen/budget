import React, { useEffect } from "react";

// Components
import { CategorySelection } from "./CategorySelection";

export function Dialog({
  closeDialog,
  selectedLedgerIdList,
  selectLedger,
  deselectLedger,
  ledgerSelectionList,
}) {
  useEffect(() => {
    document.body.classList.add("prevent-scroll");
    return () => document.body.classList.remove("prevent-scroll");
  }, []);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full lg:w-3/5 mx-auto p-0 transition-all duration-300 z-50 bg-white/5 overflow-hidden padding-safe-area-top flex flex-col justify-start">
      <div className="bg-white dark:bg-dark-mode-bg-0 w-full h-full overflow-hidden padding-safe-area-bottom transition-all duration-300 ease-in-out flex flex-col justify-start items-stretch">
        <div className="bg-primary-blue w-full flex flex-row justify-center items-center py-2 font-bold min-h-10">
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
          {ledgerSelectionList.map(
            ({ envelopeName, envelopeType, envelopeLedgers }) => (
              <CategorySelection
                key={envelopeName}
                section={envelopeName}
                envelopeType={envelopeType}
                ledgerList={envelopeLedgers}
                selectedLedgerIdList={selectedLedgerIdList}
                selectLedger={selectLedger}
                deselectLedger={deselectLedger}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
