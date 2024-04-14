import React from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../../../api/Ledger/LedgerCollection";
import { EnvelopeCollection } from "../../../../api/Envelope/EnvelopeCollection";

// Components
import { LedgerSelectionSectionList } from "./LedgerSelectionList";

// Util
import { cap } from "../../../util/cap";

export function Dialog({
  closeDialog,
  selectedLedgerIdList,
  selectLedger,
  deselectLedger,
  transactionType,
}) {
  const envelopeNames = useTracker(() => {
    // Return all of the envelopes in an dictionary where each key is the
    // envelope._id and each value is the envelope name.
    // { "123abc": "House", "456def": "Vehicles", "789ghi": "Groceries" } etc.
    return EnvelopeCollection.find({}, { fields: { _id: 1, name: 1 } })
      .fetch()
      .reduce(
        (acc, envelope) => {
          return { ...acc, [envelope._id]: cap(envelope.name) };
        },
        { uncategorized: "uncategorized" }
      );
  });

  // Get all the ledgers in this budget. This list is used to populate the
  // form selection
  const {
    income: incomeLedgers,
    expense: expenseLedgers,
    savings: savingsLedgers,
    allocation: allocationLedgers,
  } = useTracker(() => {
    // Add uncategorized ledger document to the ledgers list. This is the
    // default ledger when creating a new transaction and the user doesn't
    // select a ledger
    const ledgerList = [
      ...LedgerCollection.find().fetch(),
      {
        _id: "uncategorized",
        name: "uncategorized",
        kind: "expense",
        envelopeId: "uncategorized",
      },
    ].sort((a, b) => {
      // Sort the ledgers by ledgerName. ASC sort.
      return (
        a.name.toLowerCase().charCodeAt(0) - b.name.toLowerCase().charCodeAt(0)
      );
    });

    // Group ledgers by their type. income, expense, savings, allocation.
    const ledgerListGroupedByKind = ledgerList.reduce(
      (acc, ledger) => {
        return {
          ...acc,
          [ledger.kind]: [
            ...acc[ledger.kind],
            { ...ledger, envelopeName: envelopeNames[ledger.envelopeId] },
          ],
        };
      },
      {
        income: [],
        expense: [],
        savings: [],
        allocation: [],
      }
    );

    // Now sort each ledger by their envelope name. Each ledger list will now
    // be sorted ASC according to their envelope name and the ledger name.
    for (const [kind, ledgers] of Object.entries(ledgerListGroupedByKind)) {
      ledgerListGroupedByKind[kind] = ledgers.sort((a, b) => {
        return (
          a.envelopeName.toLowerCase().charCodeAt(0) -
          b.envelopeName.toLowerCase().charCodeAt(0)
        );
      });
    }

    return ledgerListGroupedByKind;
  });

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full lg:w-3/5 mx-auto p-0 transition-all duration-300 z-50 bg-white/5 overflow-hidden padding-safe-area-top flex flex-col justify-start">
      <div className="bg-app w-full h-full overflow-hidden padding-safe-area-bottom transition-all duration-300 ease-in-out flex flex-col justify-start items-stretch">
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
