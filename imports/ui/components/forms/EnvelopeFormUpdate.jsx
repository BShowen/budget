import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";

// Components
import { FaRegTrashAlt } from "react-icons/fa";

// Utils
import { cap } from "../../util/cap";

export const EditEnvelopeForm = ({ envelopeId, envelopeName, toggleForm }) => {
  const [submitFormTimeoutId, setFormTimeoutId] = useState(null);
  const [trashCanBlurTimeoutId, setTrashCanTimeoutId] = useState(null);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (focused === "name") {
      const formElement = e.target.parentElement;
      const formData = {
        ...Object.fromEntries(new FormData(formElement).entries()),
        envelopeId,
      };
      if (formData.name.trim()) {
        setFormTimeoutId(
          setTimeout(() => {
            Meteor.call("envelope.updateEnvelope", formData, (error) => {
              if (error) {
                console.log(error);
              }
              toggleForm();
            });
          }, 10)
        );
      } else {
        toggleForm();
      }
    } else if (focused == "trashCan") {
      handleTrashCanClick(e);
    } else {
      toggleForm();
    }
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
  }, [focused]);

  return (
    <div className="w-full h-full flex flex-row items-center">
      <form className="w-full h-full flex flex-row justify-between items-center ">
        <input
          className="h-full p-0 font-bold text-xl font-extra-bold form-input outline-none border-0 focus:ring-0 w-8/12"
          autoFocus
          type="text"
          name="name"
          defaultValue={cap(envelopeName)}
          onFocus={(e) => {
            clearTimeout(trashCanBlurTimeoutId);
            clearTimeout(submitFormTimeoutId);
            setFocused("name");
            e.target.setSelectionRange(0, 999);
          }}
          onBlur={handleSubmit}
        />
        <button
          onFocus={() => {
            clearTimeout(submitFormTimeoutId);
            setFocused("trashCan");
          }}
          onClick={handleTrashCanClick}
          onBlur={() => {
            setTrashCanTimeoutId(
              setTimeout(() => {
                toggleForm();
              }, 10)
            );
          }}
          type="button"
          className="focus:ring-0 outline-none text-rose-500 focus:text-rose-700 border-0 active:border-0 hover:border-0 "
        >
          <FaRegTrashAlt className="text-inherit lg:hover:cursor-pointer lg:hover:text-rose-700 text-lg" />
        </button>
      </form>
    </div>
  );
};
