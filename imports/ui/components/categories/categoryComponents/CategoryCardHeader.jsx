import React, { useState } from "react";

import { EnvelopeFormUpdate } from "../../forms/EnvelopeFormUpdate";

// Utils
import { cap } from "../../../util/cap";
import { toDollars } from "../../../util/toDollars";

export function CategoryCardHeader({
  name,
  activeTab,
  displayBalance,
  envelopeId,
}) {
  const canEdit = name !== "income" && name !== "savings";

  const [isEditing, setEditing] = useState(false);

  const toggleEditing = () => setEditing((prev) => !prev);

  const handleClick = () => {
    if (!canEdit) return;
    toggleEditing();
  };

  let categoryName = "";
  switch (activeTab) {
    case "planned":
      categoryName = "planned";
      break;
    case "spent":
      categoryName = "income received";
      break;
    case "remaining":
      categoryName = "left to receive";
      break;
  }
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
              className={`z-50 font-bold ${
                canEdit && "lg:hover:cursor-pointer"
              }`}
            >
              {cap(name)}
            </h1>
          </div>
          <div className="flex flex-row justify-center items-center gap-1">
            <h2 className="text-sm font-medium relative z-50 text-color-dark-blue">
              {cap(categoryName)}
            </h2>
            <h2 className="text-sm">{toDollars(displayBalance)}</h2>
          </div>
        </>
      )}
    </div>
  );
}
