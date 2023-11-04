import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";

// Utils
import { formatDollarAmount } from "../util/formatDollarAmount";

export function NewLedgerForm({ toggleForm, envelopeId }) {
  const [state, setState] = useState({
    envelopeId: envelopeId,
    name: "",
    startingBalance: "",
  });
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    // Close the form when the escape key is pressed
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        toggleForm();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      // Submit
      try {
        Meteor.call("ledger.createLedger", state);
      } catch (error) {
        console.log(error);
      }
    }
    // Reset the form state
    setState((prev) => ({
      ...prev,
      name: "",
      startingBalance: "",
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
    <div className="w-full h-full">
      <form className="w-full flex flex-row justify-between h-full">
        <input
          className="focus:ring-0 border-0 w-1/3 h-full p-0 m-0 bg-inherit font-semibold"
          name="name"
          placeholder="Item name"
          autoFocus
          value={state.name}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          // onFocus get clear the timeout that is stored in state
          onFocus={() => clearTimeout(timeoutId)}
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
          onFocus={() => clearTimeout(timeoutId)}
          // onBlur start a timeout and store its ID in state
          onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
        />
      </form>
    </div>
  );
}
