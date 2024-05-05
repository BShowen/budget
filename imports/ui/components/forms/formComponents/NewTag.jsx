import React, { useLayoutEffect, useRef, useState } from "react";

// Utils
import { cap } from "../../../util/cap";

// Icons
import { LuXCircle } from "react-icons/lu";

export function NewTag({ _id, name, setName, removeTag }) {
  const [scrollWidth, setScrollWidth] = useState(50);
  const inputRef = useRef();

  function handleChange(e) {
    setName({ id: _id, newName: e.target.value });
  }

  function handleBlur(e) {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (e.target.value.trim().length == 0) {
      setName({ id: _id, newName: "New tag" });
    }
  }

  useLayoutEffect(() => {
    inputRef.current.style.width = "10px";
    setScrollWidth(inputRef.current.scrollWidth);
  }, [name]);

  return (
    <div
      className="border border-color-dark-blue ps-1 pe-2 rounded-md bg-color-dark-blue text-white hover:cursor-text flex flex-row justify-start items-center gap-1"
      onClick={() => inputRef.current.focus()}
    >
      <button
        type="button"
        className="h-full  hover:cursor-pointer hover:text-gray-500 transition-color duration-100 ease-in-out"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeTag();
        }}
      >
        <LuXCircle className="h-5 w-auto" />
      </button>
      <input
        autoFocus
        onFocus={(e) => e.target.setSelectionRange(0, 1000)}
        onBlur={handleBlur}
        ref={inputRef}
        className="outline-none bg-inherit"
        style={{
          width: `${scrollWidth}px`,
        }}
        type="text"
        onChange={handleChange}
        value={cap(name)}
      />
    </div>
  );
}
