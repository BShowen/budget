import React from "react";

// Utils
import { cap } from "../../../util/cap";

export function Tag({ name, isSelected, selectTag, deselectTag }) {
  return (
    <button
      type="button"
      className={`transition-all duration-75 no-tap-button text-md font-semibold border-2 border-color-dark-blue px-2 rounded-md min-w-max ${
        isSelected ? "bg-color-dark-blue text-white" : ""
      }`}
      onClick={isSelected ? deselectTag : selectTag}
    >
      <p>{cap(name)}</p>
    </button>
  );
}
