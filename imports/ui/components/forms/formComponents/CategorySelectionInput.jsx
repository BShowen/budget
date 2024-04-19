import React from "react";

// Components
import { SelectedLedger } from "./SelectedLedger";
import { Dialog } from "./Dialog";

// Icons
import { IoIosAdd } from "react-icons/io";

export function CategorySelectionInput({
  selectedLedgerList,
  selectLedger,
  deselectLedger,
  setLedgerAmount,
  transactionType,
  isDialogOpen,
  setIsDialogOpen,
}) {
  return (
    <div className="w-full rounded-xl overflow-hidden px-1 py-1 bg-white flex flex-col justify-start items-stretch min-h-10 shadow-sm">
      <div className="w-full text-start px-1">
        <p className="font-semibold">Category</p>
      </div>

      {selectedLedgerList.map(({ ledgerId, amount }) => (
        <SelectedLedger
          key={ledgerId}
          ledgerId={ledgerId}
          amount={amount}
          deselectLedger={deselectLedger}
          setLedgerAmount={setLedgerAmount}
          isSplitTransaction={selectedLedgerList.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="w-full h-10 flex flex-row justify-start items-center gap-2 px-1"
      >
        <IoIosAdd className="rounded-full w-6 h-6 text-white bg-green-600" />
        <p className="font-semibold text-lg">Select category</p>
      </button>

      {isDialogOpen && (
        <Dialog
          closeDialog={() => setIsDialogOpen(false)}
          isOpen={isDialogOpen}
          selectLedger={selectLedger}
          deselectLedger={deselectLedger}
          selectedLedgerIdList={selectedLedgerList.map(
            ({ ledgerId }) => ledgerId
          )}
          transactionType={transactionType}
        />
      )}
    </div>
  );
}
