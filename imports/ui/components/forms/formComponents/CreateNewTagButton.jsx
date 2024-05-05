import React from "react";

// Icons
import { IoIosAdd } from "react-icons/io";

export function CreateNewTagButton({ createNewTag }) {
  return (
    <button
      type="button"
      className="w-full h-10 flex flex-row justify-start items-center gap-1 px-1"
      onClick={createNewTag}
    >
      <IoIosAdd className="rounded-full w-5 h-5 text-white bg-green-600/80" />
      <p>Add tag</p>
    </button>
  );
}
