import { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Utils
import { formatDollarAmount } from "../../../util/formatDollarAmount";
import { splitDollars } from "../../../util/splitDollars";

// Collections
import { LedgerCollection } from "../../../../api/Ledger/LedgerCollection";
import { EnvelopeCollection } from "../../../../api/Envelope/EnvelopeCollection";

export function useFormLedgerSelection({
  initialLedgerSelection,
  initialFormTotal,
  transactionType,
}) {
  if (initialLedgerSelection) {
    if (Array.isArray(initialLedgerSelection)) {
      initialLedgerSelection = initialLedgerSelection.map((allocation) => ({
        ...allocation,
        kind: transactionType,
      }));
    } else {
      initialLedgerSelection = [
        {
          ...initialLedgerSelection,
          ledgerId: initialLedgerSelection._id,
          kind: transactionType,
        },
      ];
    }
  }
  const [formTotal, setFormTotal] = useState(initialFormTotal || 0);

  const [selectedLedgerList, setSelectedLedgerList] = useState(
    initialLedgerSelection ? initialLedgerSelection : []
  );

  const [transType, setTransType] = useState(transactionType);

  const ledgerSelectionList = useTracker(() => {
    // if its expense we can show "savings" & "expense"
    // if its income was can show "income", "savings", & "expense"
    const querySelector =
      transType == "expense"
        ? { $or: [{ kind: "savings" }, { kind: "expense" }] }
        : {};

    const envelopeList = EnvelopeCollection.find({})
      .fetch()
      .sort(
        (a, b) =>
          a.name.toLowerCase().charCodeAt(0) -
          b.name.toLowerCase().charCodeAt(0)
      );
    const ledgersGroupedByEnvelope = envelopeList.map((envelope) => {
      const {
        _id: envelopeId,
        name: envelopeName,
        kind: envelopeType,
      } = envelope;
      const envelopeLedgers = LedgerCollection.find({
        envelopeId,
        ...querySelector,
      })
        .fetch()
        .sort(
          (a, b) =>
            a.name.toLowerCase().charCodeAt(0) -
            b.name.toLowerCase().charCodeAt(0)
        );

      return { envelopeName, envelopeType, envelopeLedgers };
    });

    return ledgersGroupedByEnvelope;
  }, [transType]);

  function selectLedger({ ledger }) {
    const { name, envelopeId, _id: ledgerId, kind } = ledger;
    setSelectedLedgerList((prev) => {
      const newLedgerList = [
        ...prev,
        {
          ledgerId,
          envelopeId,
          name,
          amount: 0,
          isLocked: false,
          kind,
        },
      ];
      return splitBetweenLedgers({
        amount: formTotal,
        ledgerList: newLedgerList,
      });
    });
  }

  function deselectLedger({ ledger }) {
    setSelectedLedgerList((prev) => {
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
    setSelectedLedgerList((prev) => {
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
    setSelectedLedgerList((prev) => {
      const newLedgerList = [...prev];
      return splitBetweenLedgers({
        amount: parseFloat(newTotal),
        ledgerList: newLedgerList,
      });
    });
    setFormTotal(parseFloat(newTotal));
  }

  function removeIncomeLedgers() {
    setSelectedLedgerList((prev) => {
      const newLedgerList = [...prev].filter((doc) => doc.kind !== "income");
      return splitBetweenLedgers({
        amount: formTotal,
        ledgerList: newLedgerList,
      });
    });
  }

  return {
    setTransactionType: (transactionType) => {
      transactionType === "expense" && removeIncomeLedgers();
      setTransType(transactionType);
    },
    // This is a list of ledgers that the user has selected.
    selectedLedgerList,
    selectLedger,
    deselectLedger,
    setLedgerAmount,
    setSplitAmount,
    // This is a list of the ledgers that the user can select from.
    ledgerSelectionList,
  };
}
