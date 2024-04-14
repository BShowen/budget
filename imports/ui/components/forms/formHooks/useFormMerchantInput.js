import { useState } from "react";

export function useFormMerchantInput({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  function isValid() {
    return (value != undefined || value != false) && value.trim().length > 0;
  }

  const inputProps = {
    value,
    onChange: handleChange,
    isValid,
  };

  return inputProps;
}
