import React, { useState } from "react";

import { EnvelopeFormUpdate } from "../../forms/EnvelopeFormUpdate";

// Utils
import { cap } from "../../../util/cap";
import { toDollars } from "../../../util/toDollars";

export function CategoryCardHeader({ name, displayBalance, envelopeId }) {
  const canEdit = name !== "income" && name !== "savings";

  const [isEditing, setEditing] = useState(false);

  const toggleEditing = () => setEditing((prev) => !prev);

  const handleClick = () => {
    if (!canEdit) return;
    toggleEditing();
  };
  return (
    <div className="envelope-header">
      {isEditing ? (
        <EnvelopeFormUpdate
          envelopeId={envelopeId}
          envelopeName={name}
          toggleForm={toggleEditing}
        />
      ) : (
        <>
          <div className="relative">
            <h1
              onClick={handleClick}
              className={`z-50 text-lg font-medium ${
                canEdit && "lg:hover:cursor-pointer"
              }`}
            >
              {cap(name)}
            </h1>
          </div>
          <div className="flex flex-row justify-center items-center gap-1">
            <h2 className="text-sm relative z-50 text-color-dark-blue">
              {cap(displayBalance.text)}
            </h2>
            <h2 className="text-sm">{toDollars(displayBalance.value)}</h2>
          </div>
        </>
      )}
    </div>
  );
}
