import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";

// Utils
import { formatDollarAmount } from "../../util/formatDollarAmount";

export function NewLedgerForm({
  children,
  toggleForm,
  envelopeId,
  isAllocation = false,
  placeholderText,
}) {
  const defaultFormValues = {
    name: "",
    allocatedAmount: "0.00",
  };
  const [state, setState] = useState({
    name: "",
    allocatedAmount: "0.00",
  });

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    // Close the form when the escape key is pressed
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        toggleForm();
        // Reset the form state
        setState({ ...defaultFormValues });
      }
    }
    if (!children) {
      // Only add an event listener if children are rendered.
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [children]);

  function handleInput(e) {
    if (e.key === "Enter") {
      // Submit form when enter key is pressed
      e.preventDefault(); // Prevent the default form submission
      handleSubmit(); // Trigger form submission logic
    } else {
      // Update the form state
      const name = e.target.name;
      const value =
        name === "allocatedAmount"
          ? formatDollarAmount(e.target.value)
          : e.target.value;
      setState((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit() {
    if (state.name && state.name.trim().length) {
      try {
        const formData = { ...state, envelopeId, isAllocation };
        if (isAllocation) {
          // Create an allocation ledger
          Meteor.call("allocationLedger.createLedger", formData);
        } else {
          // Create new ledger
          Meteor.call("ledger.createLedger", formData);
        }
      } catch (error) {
        console.log(error);
      }
    }
    // Reset the form state
    setState({ ...defaultFormValues });
    toggleForm();
  }

  return (
    children || (
      <div className="w-full h-7 relative z-0 px-1 py-1 bg-slate-100 rounded-lg lg:hover:cursor-pointer flex flex-row justify-between items-center">
        <form className="w-full flex flex-row justify-between h-full">
          <input
            className="form-input focus:ring-0 border-0 w-8/12 h-full p-0 m-0 bg-inherit font-semibold"
            name="name"
            placeholder={placeholderText || "Category name"}
            autoFocus={true}
            value={state.name}
            onInput={handleInput}
            onKeyDown={handleInput}
            // onFocus clear the timeout that is stored in state
            onFocus={(e) => {
              clearTimeout(timeoutId);
              e.target.setSelectionRange(0, 1000);
            }}
            // onBlur start a timeout and store its ID in state
            onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
          />
          <input
            className="form-input focus:ring-0 border-0 w-4/12 h-full p-0 m-0 bg-inherit text-right font-semibold"
            name="allocatedAmount"
            placeholder="$0.00"
            pattern="[0-9]*"
            value={state.allocatedAmount}
            onInput={handleInput}
            onKeyDown={handleInput}
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
