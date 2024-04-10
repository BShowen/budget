import { useState } from "react";

export function useFormMerchantInput({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value,
    onChange: handleChange,
  };

  return inputProps;
}
