import React, { useState } from "react";

// Utils
import { cap } from "../../../util/cap";

export function Tag({ tag, isChecked }) {
  const [checked, setChecked] = useState(isChecked || false);
  const toggleChecked = () => setChecked((prev) => !prev);

  return (
    <div
      className={`transition-all duration-75 no-tap-button text-md font-semibold border-2 border-color-dark-blue px-2 rounded-md min-w-max ${
        checked ? "bg-color-dark-blue text-white" : ""
      }`}
      onClick={toggleChecked}
    >
      <p>{cap(tag.name)}</p>
      <input
        className="hidden form-input"
        type="checkbox"
        value={tag._id}
        checked={checked}
        onChange={toggleChecked}
        name="tags"
      />
    </div>
  );
}
