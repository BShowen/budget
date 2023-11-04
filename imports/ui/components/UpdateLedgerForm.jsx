import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";

// Utils
import { formatDollarAmount } from "../util/formatDollarAmount";
import { cap } from "../util/cap";

export function UpdateLedgerForm({
  children,
  toggleForm,
  envelopeId,
  ledgerId,
  name,
  startingBalance,
  updateForm,
}) {
  const [timeoutId, setTimeoutId] = useState(null);
  useEffect(() => {
    // Close the form when the escape key is pressed
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        toggleForm();
      }
    }
    if (!children) {
      // Only add an event listener if children are rendered.
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [children]);

  function handleSubmit() {
    if (name) {
      // Update ledger
      try {
        Meteor.call("ledger.updateLedger", {
          name,
          startingBalance,
          ledgerId,
          envelopeId,
        });
      } catch (error) {
        console.log(error);
      }
    }
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
            type="text"
            className="focus:ring-0 border-0 w-1/3 h-full p-0 m-0 bg-inherit font-semibold"
            name="name"
            placeholder="Item name"
            value={cap(name)}
            onInput={updateForm}
            onKeyDown={handleKeyDown}
            // onFocus get clear the timeout that is stored in state
            onFocus={(e) => {
              clearTimeout(timeoutId);
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
            value={parseFloat(startingBalance || 0).toFixed(2)}
            onInput={updateForm}
            onKeyDown={handleKeyDown}
            // onFocus get clear the timeout that is stored in state
            onFocus={(e) => {
              clearTimeout(timeoutId);
              e.target.setSelectionRange(0, 999);
            }}
            // onBlur start a timeout and store its ID in state
            onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
          />
        </form>
      </div>
    )
  );
}
