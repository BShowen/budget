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
    <div className="flex flex-col justify-start items-start overflow-hidden relative z-0 w-full h-14">
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
              className={`z-50 text-lg font-bold ${
                canEdit && "lg:hover:cursor-pointer"
              }`}
            >
              {cap(name)}
            </h1>
          </div>
          <div className="flex flex-row justify-center items-center gap-1">
            <h2 className="text-sm relative z-50 font-semibold text-category-blue-text">
              {cap(displayBalance.text)}
            </h2>
            <h2 className="text-sm text-category-price-color font-medium">
              {toDollars(displayBalance.value)}
            </h2>
          </div>
        </>
      )}
    </div>
  );
}
