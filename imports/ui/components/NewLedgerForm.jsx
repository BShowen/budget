import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";

// Utils
import { formatDollarAmount } from "../util/formatDollarAmount";

export function NewLedgerForm({
  children,
  toggleForm,
  envelopeId,
  defaultValues = { name: "", startingBalance: 0.0, ledgerId: "" },
}) {
  const [state, setState] = useState({
    envelopeId: envelopeId,
    name: defaultValues.name,
    startingBalance: defaultValues.startingBalance.toFixed(2),
  });
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (
      state.name !== defaultValues.name ||
      state.startingBalance !== defaultValues.startingBalance.toFixed(2)
    ) {
      setState((prev) => ({
        ...prev,
        name: defaultValues.name,
        startingBalance: defaultValues.startingBalance.toFixed(2),
      }));
    }
  }, [defaultValues.name, defaultValues.startingBalance]);

  useEffect(() => {
    // Close the form when the escape key is pressed
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        toggleForm();
        // Reset the form state
        setState((prev) => ({
          ...prev,
          name: defaultValues.name,
          startingBalance: defaultValues.startingBalance.toFixed(2),
        }));
      }
    }
    if (!children) {
      // Only add an event listener if children are rendered.
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [children]);

  function handleInput(e) {
    const name = e.target.name;
    const value =
      name === "startingBalance"
        ? formatDollarAmount(e.target.value)
        : e.target.value;
    setState((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (state.name) {
      // Create new ledger
      try {
        Meteor.call("ledger.createLedger", state);
      } catch (error) {
        console.log(error);
      }
    }
    // Reset the form state
    setState((prev) => ({
      ...prev,
      name: defaultValues.name,
      startingBalance: defaultValues.startingBalance.toFixed(2),
    }));
    toggleForm();
  }

  function handleKeyDown(e) {
    // Submit form when enter key is pressed
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission
      handleSubmit(); // Trigger your form submission logic
    }
  }

  return (
    children || (
      <div className="w-full h-full">
        <form className="w-full flex flex-row justify-between h-full">
          <input
            className="focus:ring-0 border-0 w-1/3 h-full p-0 m-0 bg-inherit font-semibold"
            name="name"
            placeholder="Item name"
            autoFocus={true}
            value={state.name}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            // onFocus get clear the timeout that is stored in state
            onFocus={(e) => {
              clearTimeout(timeoutId);
              e.target.setSelectionRange(0, 1000);
            }}
            // onBlur start a timeout and store its ID in state
            onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
          />
          <input
            className="focus:ring-0 border-0 w-1/3 h-full p-0 m-0 bg-inherit text-right"
            name="startingBalance"
            placeholder="$0.00"
            pattern="[0-9]*"
            value={state.startingBalance}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            // onFocus get clear the timeout that is stored in state
            onFocus={(e) => {
              clearTimeout(timeoutId);
              e.target.setSelectionRange(0, 1000);
            }}
            // onBlur start a timeout and store its ID in state
            onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
          />
        </form>
      </div>
    )
  );
}
