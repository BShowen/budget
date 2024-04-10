import React from "react";

export function MerchantInput({ transactionType, value, onChange }) {
  return (
    <div className="w-full flex flex-row items-stretch justify-end h-9 relative bg-white rounded-xl overflow-hidden shadow-sm">
      <label
        className="bg-color-light-blue text-white rounded-xl w-4/12 flex flex-row justify-center items-center text-lg absolute left-0 h-full"
        htmlFor="merchant"
      >
        <p className="font-semibold">
          {transactionType === "expense" ? "Merchant" : "Source"}
        </p>
      </label>
      <div className="w-9/12 bg-white flex flex-row justify-center items-center">
        <input
          type="text"
          onFocus={(e) => e.target.setSelectionRange(0, 999)}
          placeholder="Name"
          required
          id="merchant"
          name="merchant"
          value={value}
          onInput={onChange}
          className="px-0 focus:ring-0 border-0 form-input h-full text-lg w-full text-center placeholder:font-semibold font-semibold"
        />
      </div>
    </div>
  );
}
