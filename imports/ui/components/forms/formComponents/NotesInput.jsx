import React from "react";

export function NotesInput({ value, onChange }) {
  return (
    <div className="w-full flex flex-row items-stretch justify-end min-h-9 bg-white rounded-xl overflow-hidden shadow-sm">
      <textarea
        rows={2}
        placeholder="Add a note"
        value={value}
        onInput={onChange}
        name="note"
        className="text-left w-full focus:ring-0 border-0 form-input h-full placeholder:font-semibold flex flex-row justify-start items-center px-2 py-1"
      />
    </div>
  );
}
