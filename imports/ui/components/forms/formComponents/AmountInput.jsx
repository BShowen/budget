import React from "react";

// Utils
import { toDollars } from "../../../util/toDollars";
export function AmountInput({ value, onChange }) {
  const displayValue = toDollars(value);
  return (
    <div className="w-full h-20">
      <input
        onFocus={(e) => e.target.setSelectionRange(0, 999)}
        type="text"
        inputMode="decimal"
        // pattern="[0-9]*"
        placeholder="$0.00"
        required
        name="amount"
        id="amount"
        value={displayValue}
        onInput={onChange}
        min={0}
        autoFocus
        className="w-full h-full focus:ring-0 border-0 form-input text-center p-0 m-0 text-6xl bg-transparent font-bold"
      />
    </div>
  );
}
