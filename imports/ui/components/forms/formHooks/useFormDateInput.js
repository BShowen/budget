import { useState } from "react";

export function useFormDateInput({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    console.log(e.target.value);
    setValue(e.target.value);
  }

  function isValid() {
    return value != undefined && new Date(value) != "Invalid Date";
  }

  function getSubmitValue() {
    // The date string is received as 'YYYY-MM-DD' from the DOM.
    // I convert it to 'YYYY/MM/DD'. If you create a date like:
    // new Date('2024-04-01') and call toLocaleString() it will
    // return 03/31/2024 because of timezone reasons. If you use
    // the same date like this: new Date('2024/04/01') and call
    // toLocaleString() it will return what you expect: 04/01/2024.
    // This is the easiest way for me to fix this right now without
    // handling timezones or using a date/time library.
    return new Date(value.replace(/-/g, "/")).getTime();
  }

  const inputProps = {
    value,
    // submitValue: value + "T00:00:00",
    submitValue: getSubmitValue(),
    onChange: handleChange,
    isValid,
  };

  return inputProps;
}
