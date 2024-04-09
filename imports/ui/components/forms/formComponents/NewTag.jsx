import React, { useRef, useState, useEffect } from "react";

export function NewTag({ defaultValue, removeTag, saveTag, id, autoFocus }) {
  const pRef = useRef();
  const inputRef = useRef();
  const [tagName, setTagName] = useState(defaultValue || "");
  const [inputWidth, setInputWidth] = useState(96);

  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key;
      if (key.toLowerCase() === "enter") {
        inputRef.current.blur();
      }
    }
    if (inputRef.current) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  const handleInput = (e) => {
    setTagName(e.target.value);
    // setTimeout is needed in order to allow the browser to finish painting
    // before we read the value of the hidden <p> element
    setTimeout(() => {
      if (pRef.current) {
        const pElementWidth = pRef.current.getBoundingClientRect().width;
        const newWidth = pElementWidth > 96 ? pElementWidth + 10 : 96;
        setInputWidth(newWidth);
      }
    }, 0);
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      setTagName(defaultValue);
      removeTag({ id: id }); //This will tell the parent to remove this component.
    } else {
      saveTag({
        tagName,
        id,
      });
    }
  };

  const handleClick = (e) => {
    if (tagName === defaultValue) {
      e.target.setSelectionRange(0, 99999);
    }
  };

  return (
    <div className="no-tap-button text-md font-semibold border-2 border-color-dark-blue px-2 rounded-md overflow-hidden py-0 bg-color-dark-blue text-white">
      {/* This hidden p tag gets populated with the value that the user types 
      for the tag name. I use this to get the width of the element and set the 
      width of the input tag. I want the input's width to be dynamic and always
      contain the user's text.  */}
      <p className="fixed invisible" ref={pRef}>
        {tagName}
      </p>
      <input
        ref={inputRef}
        className="focus:ring-0 border-0 m-0 p-0 w-24 h-6 text-center bg-inherit text-inherit transition-width duration-100  form-input"
        style={{
          width: `${inputWidth}px`,
        }}
        type="text"
        autoFocus={autoFocus}
        value={tagName}
        onInput={handleInput}
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={handleClick}
      />
      <input
        type="checkbox"
        checked
        readOnly
        className="hidden form-input"
        value={tagName}
        name="newTags"
      />
    </div>
  );
}
