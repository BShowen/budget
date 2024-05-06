import React from "react";

export function DateInput({ value, onChange }) {
  return (
    <div className="w-full flex flex-row items-center justify-end h-8 relative bg-white rounded-lg overflow-hidden shadow-sm">
      <label
        className="bg-color-light-blue text-white bg-gray-200 rounded-sm w-fit px-5 flex flex-row justify-center items-center absolute left-0 h-full"
        htmlFor="date"
      >
        <p>Date</p>
      </label>
      <div className="w-full bg-white flex flex-row justify-center items-center">
        <input
          type="date"
          name="createdAt"
          value={value}
          onChange={onChange}
          required
          id="date"
          className="px-0 focus:ring-0 border-0 form-input h-full"
        />
      </div>
    </div>
  );
}
