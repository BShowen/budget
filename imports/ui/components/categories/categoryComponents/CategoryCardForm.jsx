import React, { useState } from "react";

// Components
import { NewLedgerForm } from "../../forms/LedgerFormCreate";

// Icons
import { LuPlusCircle } from "react-icons/lu";

export function CategoryCardForm({ envelopeId }) {
  const [isFormActive, setFormActive] = useState(false);
  const toggleForm = () => {
    setFormActive((prev) => !prev);
  };

  return (
    <div>
      <NewLedgerForm
        toggleForm={toggleForm}
        envelopeId={envelopeId}
        placeholderText={"Category name"}
      >
        {!isFormActive && (
          <div className="w-full h-7 flex flex-row justify-start items-center">
            <button
              className="flex flex-row justify-start items-center gap-1 dark:text-dark-mode-text-1"
              onClick={() => {
                if (!isFormActive) {
                  toggleForm();
                }
              }}
            >
              <LuPlusCircle className="w-5 h-5" />
              <p className="text-sm lg:hover:cursor-pointer">Add category</p>
            </button>
          </div>
        )}
      </NewLedgerForm>
    </div>
  );
}
