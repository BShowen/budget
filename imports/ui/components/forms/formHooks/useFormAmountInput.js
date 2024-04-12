import { useState } from "react";

export function useFormAmountInput({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  const inputProps = {
    amount: value,
    setFormAmount: setValue,
  };

  return inputProps;
}
