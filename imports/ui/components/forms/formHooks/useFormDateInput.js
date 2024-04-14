import { useState } from "react";

export function useFormDateInput({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  function isValid() {
    return value != undefined && new Date(value) != "Invalid Date";
  }

  const inputProps = {
    value,
    onChange: handleChange,
    isValid,
  };

  return inputProps;
}
