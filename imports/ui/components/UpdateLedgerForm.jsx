import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";

// Utils
import { formatDollarAmount } from "../util/formatDollarAmount";
import { cap } from "../util/cap";

export function UpdateLedgerForm({ toggleForm, ledger }) {
  const [formState, setFormState] = useState({
    name: ledger.name,
    startingBalance: ledger.startingBalance,
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

  function handleKeyDown(e) {
    // Submit form when enter key is pressed
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission
      handleSubmit(); // Trigger form submission logic
    }
  }

  function handleSubmit() {
    // Update ledger
    if (formState.name.trim().length) {
      try {
        Meteor.call(
          "ledger.updateLedger",
          { ...ledger, ...formState },
          toggleForm
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "startingBalance") {
      setFormState((prev) => ({
        ...prev,
        [name]: formatDollarAmount(value),
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  }

  return (
    <div className="w-full h-full z-20">
      <form className="w-full flex flex-row justify-between h-full">
        <input
          type="text"
          className="focus:ring-0 border-0 w-1/3 h-full p-0 m-0 bg-inherit font-semibold"
          name="name"
          placeholder="Item name"
          value={cap(formState.name)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          // onFocus get clear the timeout that is stored in state
          onFocus={(e) => {
            if (timeoutId) clearTimeout(timeoutId);
            e.target.setSelectionRange(0, 999);
          }}
          // onBlur start a timeout and store its ID in state
          onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
        />
        <input
          type="text"
          inputMode="decimal"
          className="focus:ring-0 border-0 w-1/3 h-full p-0 m-0 bg-inherit text-right"
          name="startingBalance"
          autoFocus={true}
          placeholder="$0.00"
          pattern="[0-9]*"
          value={parseFloat(formState.startingBalance || 0).toFixed(2)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          // onFocus get clear the timeout that is stored in state
          onFocus={(e) => {
            if (timeoutId) clearTimeout(timeoutId);
            e.target.setSelectionRange(0, 999);
          }}
          // onBlur start a timeout and store its ID in state
          onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
        />
      </form>
    </div>
  );
}
