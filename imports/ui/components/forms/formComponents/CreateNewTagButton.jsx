import React from "react";

// Icons
import { IoIosAdd } from "react-icons/io";

export function CreateNewTagButton({ createNewTag }) {
  return (
    <button type="button" className="flex flex-row flex-no-wrap items-center">
      <IoIosAdd
        className="rounded-full w-6 h-6 text-white bg-green-600"
        onClick={createNewTag}
      />
    </button>
  );
}
