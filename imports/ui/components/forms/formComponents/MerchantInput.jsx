import React from "react";

export function MerchantInput({ transactionType, value, onChange }) {
  return (
    <div className="w-full flex flex-row items-stretch justify-end h-8 relative bg-white rounded-lg overflow-hidden shadow-sm">
      <label
        className="bg-color-light-blue dark:bg-blue-700 rounded-sm w-fit px-5 flex flex-row justify-center items-center absolute left-0 h-full text-white"
        htmlFor="merchant"
      >
        <p>{transactionType === "expense" ? "Merchant" : "Source"}</p>
      </label>
      <div className="w-full flex flex-row justify-center items-center">
        <input
          type="text"
          onFocus={(e) => e.target.setSelectionRange(0, 999)}
          required
          id="merchant"
          name="merchant"
          value={value}
          onInput={onChange}
          className="px-2 focus:ring-0 border-0 form-input h-full w-full text-center dark:bg-dark-mode-bg-1"
        />
      </div>
    </div>
  );
}
