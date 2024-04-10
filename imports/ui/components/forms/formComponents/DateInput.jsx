import React from "react";

export function DateInput({ value, onChange }) {
  return (
    <div className="w-full flex flex-row items-center justify-end h-9 relative bg-white rounded-xl  overflow-hidden shadow-sm">
      <label
        className="bg-color-light-blue text-white rounded-xl w-4/12 flex flex-row justify-center items-center text-lg absolute left-0 h-full"
        htmlFor="date"
      >
        <p className="font-semibold">Date</p>
      </label>
      <div className="w-9/12 bg-white flex flex-row justify-center items-center">
        <input
          type="date"
          name="createdAt"
          value={value}
          onChange={onChange}
          required
          id="date"
          className="px-0 focus:ring-0 border-0 form-input h-full text-lg placeholder:font-semibold font-semibold"
        />
      </div>
    </div>
  );
}
