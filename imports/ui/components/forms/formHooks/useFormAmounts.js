// Hooks
import { useFormLedgerSelection } from "./useFormLedgerSelection";
import { useFormAmountInput } from "./useFormAmountInput";

// Utils
import { formatDollarAmount } from "../../../util/formatDollarAmount";

export function useFormAmounts({
  initialLedgerSelection,
  initialDollarAmount,
}) {
  const { amount, setFormAmount } = useFormAmountInput({
    initialValue: initialDollarAmount,
  });

  const { setSplitAmount, ...ledgerSelectionProps } = useFormLedgerSelection({
    initialLedgerSelection,
    initialFormTotal: amount,
  });

  function handleTransactionAmountChange(e) {
    // Convert $1,500.00 ==> 1500.00
    const strippedDollarAmount = e.target.value
      .split("$")
      .join("")
      .split(",")
      .join("");

    const formattedDollarAmount = formatDollarAmount(strippedDollarAmount);

    setFormAmount(formattedDollarAmount);
    setSplitAmount(formattedDollarAmount);
  }

  function isValid() {
    const isAmountValid = amount != undefined && parseFloat(amount) > 0;
    const isLedgerSelectionValid =
      ledgerSelectionProps.selectedLedgerList.length != 0;
    return isAmountValid && isLedgerSelectionValid;
  }

  return {
    amountInputProps: {
      value: amount,
      onChange: handleTransactionAmountChange,
      isValid,
    },
    ledgerSelectionInputProps: ledgerSelectionProps,
  };
}
