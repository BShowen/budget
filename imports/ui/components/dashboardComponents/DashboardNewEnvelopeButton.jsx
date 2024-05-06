import React from "react";
import { Meteor } from "meteor/meteor";

export const NewEnvelopeButton = ({ budgetId }) => {
  const handleClick = () => {
    Meteor.call("envelope.createEnvelope", { budgetId }, () => {
      console.log("scrolling");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  };

  return (
    <button>
      <h2
        className="w-full h-8 transition-all px-3 border-none bg-green-600/80 rounded-md lg:hover:cursor-pointer text-white active:bg-green-700 font-semibold flex flex-row justify-center items-center"
        onClick={handleClick}
      >
        New category
      </h2>
    </button>
  );
};
