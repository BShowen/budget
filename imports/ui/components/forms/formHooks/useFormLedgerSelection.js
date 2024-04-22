import { useState } from "react";

// Utils
import { formatDollarAmount } from "../../../util/formatDollarAmount";
import { splitDollars } from "../../../util/splitDollars";

export function useFormLedgerSelection({
  initialLedgerSelection,
  initialFormTotal,
}) {
  if (initialLedgerSelection && !Array.isArray(initialLedgerSelection)) {
    initialLedgerSelection = [initialLedgerSelection];
  }

  const [formTotal, setFormTotal] = useState(initialFormTotal || 0);

  const [ledgerList, setLedgerList] = useState(
    initialLedgerSelection ? initialLedgerSelection : []
  );

  function selectLedger({ ledger }) {
    const { name, envelopeId, _id: ledgerId } = ledger;
    setLedgerList((prev) => {
      const newLedgerList = [
        ...prev,
        {
          ledgerId,
          envelopeId,
          name,
          amount: 0,
          isLocked: false,
        },
      ];
      return splitBetweenLedgers({
        amount: formTotal,
        ledgerList: newLedgerList,
      });
    });
  }

  function deselectLedger({ ledger }) {
    setLedgerList((prev) => {
      const newLedgerList = [...prev].filter(
        ({ ledgerId }) => ledgerId != ledger._id
      );
      return splitBetweenLedgers({
        amount: formTotal,
        ledgerList: newLedgerList,
      });
    });
  }

  function setLedgerAmount({ ledgerId, amount }) {
    setLedgerList((prev) => {
      const newLedgerList = [...prev];
      const ledger = newLedgerList.find(({ ledgerId: id }) => id == ledgerId);
      ledger.amount = formatDollarAmount(amount);
      ledger.isLocked = amount > 0;
      return splitBetweenLedgers({
        amount: formTotal,
        ledgerList: newLedgerList,
      });
    });
  }

  function splitBetweenLedgers({ amount, ledgerList }) {
    if (ledgerList.length == 0) {
      return ledgerList;
    } else if (ledgerList.length == 1) {
      // If one ledger is selected then there is nothing to split. The entire
      // total is allocated towards this ledger.
      ledgerList[0].amount = amount;
      return ledgerList;
    }

    // 1) Sort the ledgers by lock status.
    const { lockedLedgers, unlockedLedgers } = ledgerList.reduce(
      (acc, ledger) => {
        if (ledger.isLocked) {
          return {
            ...acc,
            lockedLedgers: [...acc.lockedLedgers, ledger],
          };
        } else {
          return {
            ...acc,
            unlockedLedgers: [...acc.unlockedLedgers, ledger],
          };
        }
      },
      { lockedLedgers: [], unlockedLedgers: [] }
    );

    // 2) Calculate the amount already distributed.
    const amountAllocated = lockedLedgers.reduce((total, ledger) => {
      const currentAmount = parseFloat(ledger.amount);
      return Math.round((currentAmount + total) * 100) / 100;
    }, 0);

    // 3) Calculate the amount left to distribute.
    const amountToDistribute =
      Math.round((amount - amountAllocated) * 100) / 100;

    // 4) Calculate the amount split between the unlocked ledgers.
    const splits = splitDollars(amountToDistribute, unlockedLedgers.length);

    // 5) Distribute amount to each unlocked ledger.
    unlockedLedgers.forEach((ledger, i) => {
      ledger.amount = splits[i];
    });

    return ledgerList;
  }

  function setSplitAmount(newTotal) {
    setLedgerList((prev) => {
      const newLedgerList = [...prev];
      return splitBetweenLedgers({
        amount: parseFloat(newTotal),
        ledgerList: newLedgerList,
      });
    });
    setFormTotal(parseFloat(newTotal));
  }

  function removeIncomeLedgers() {
    setLedgerList((prev) => {
      const newLedgerList = [...prev].filter((doc) => doc.kind !== "income");
      return splitBetweenLedgers({
        amount: formTotal,
        ledgerList: newLedgerList,
      });
    });
  }

  return {
    setTransactionType: (transactionType) =>
      transactionType === "expense" && removeIncomeLedgers(),
    selectedLedgerList: ledgerList,
    selectLedger,
    deselectLedger,
    setLedgerAmount,
    setSplitAmount,
  };
}