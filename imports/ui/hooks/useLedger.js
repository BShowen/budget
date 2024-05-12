import { useTracker } from "meteor/react-meteor-data";

// Hooks
import { useIncomeLedger } from "./useIncomeLedger";
import { useExpenseLedger } from "./useExpenseLedger";
import { useSavingsLedger } from "./useSavingsLedger";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";

export function useLedger({ ledgerId }) {
  const incomeLedger = useIncomeLedger({ ledgerId });
  const expenseLedger = useExpenseLedger({ ledgerId });
  const savingsLedger = useSavingsLedger({ ledgerId });

  const ledger = useTracker(() => {
    return LedgerCollection.findOne({ _id: ledgerId });
  });

  switch (ledger.kind) {
    case "income":
      return incomeLedger;
    case "expense":
      return expenseLedger;
    case "savings":
      return savingsLedger;
  }
}
