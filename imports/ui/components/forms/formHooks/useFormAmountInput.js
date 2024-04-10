import { useState } from "react";

// Utils
import { formatDollarAmount } from "../../../util/formatDollarAmount";
export function useFormAmountInput({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    // Convert $1,500.00 ==> 1500.00
    const strippedDollarAmount = e.target.value
      .split("$")
      .join("")
      .split(",")
      .join("");

    const formattedDollarAmount = formatDollarAmount(strippedDollarAmount);

    setValue(formattedDollarAmount);
  }

  const inputProps = {
    value,
    onChange: handleChange,
  };

  return inputProps;
}
