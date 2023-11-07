import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";

// Components
import { FaRegTrashAlt } from "react-icons/fa";

// Utils
import { cap } from "../util/cap";

export const EditEnvelopeForm = ({ envelopeId, envelopeName, toggleForm }) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const focusHandler = (e) => {
    clearTimeout(timeoutId);
    e.target.setSelectionRange(0, 999);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formElement = e.target.parentElement;
    const formData = {
      ...Object.fromEntries(new FormData(formElement).entries()),
      envelopeId,
    };
    setTimeoutId(
      setTimeout(() => {
        Meteor.call("envelope.updateEnvelope", formData, (error) => {
          if (error) {
            console.log(error);
          }
          toggleForm();
        });
      }, 10)
    );
  };

  const handleTrashCanClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmation = confirm("Delete this envelope?");
    if (confirmation) {
      Meteor.call("envelope.deleteEnvelope", { envelopeId });
    } else {
      // toggleForm();
    }
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
    <div className="w-full h-full flex flex-row items-center">
      <form className="w-full h-full flex flex-row justify-between items-center ">
        <input
          className="focus:ring-0 border-0 h-full p-0 font-bold"
          autoFocus
          type="text"
          name="name"
          defaultValue={cap(envelopeName)}
          onFocus={focusHandler}
          onBlur={handleSubmit}
        />
        <button
          onFocus={() => clearTimeout(timeoutId)}
          onClick={handleTrashCanClick}
          onBlur={handleSubmit}
          type="button"
          className="focus:ring-0 outline-none text-rose-500 focus:text-rose-700 border-0 active:border-0 hover:border-0 "
        >
          <FaRegTrashAlt className="text-inherit lg:hover:cursor-pointer lg:hover:text-rose-700 text-lg" />
        </button>
      </form>
    </div>
  );
};
