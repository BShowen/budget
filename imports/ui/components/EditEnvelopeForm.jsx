import React, { useEffect } from "react";
import { Meteor } from "meteor/meteor";

// Utils
import { cap } from "../util/cap";

export const EditEnvelopeForm = ({ envelopeId, envelopeName, toggleForm }) => {
  const focusHandler = (e) => {
    e.target.setSelectionRange(0, 999);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formElement = e.target.parentElement;
    const formData = {
      ...Object.fromEntries(new FormData(formElement).entries()),
      envelopeId,
    };
    Meteor.call("envelope.updateEnvelope", formData, (error) => {
      if (error) {
        console.log(error);
      }
      toggleForm();
    });
  };

  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();
      // Close the form when the escape key is pressed
      if (key === "escape") {
        toggleForm();
      } else if (key === "enter") {
        // Submit the form when the enter key is pressed
        handleSubmit(e);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full h-full flex flex-row justify-start items-center">
      <form className="w-full h-full flex flex-row justify-start items-center ">
        <input
          className="focus:ring-0 border-0 h-full p-0 font-bold"
          autoFocus
          type="text"
          name="name"
          defaultValue={cap(envelopeName)}
          onFocus={focusHandler}
          onBlur={handleSubmit}
        />
      </form>
    </div>
  );
};
