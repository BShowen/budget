import React from "react";

// Utils
import { cap } from "../../../util/cap";
import { toDollars } from "../../../util/toDollars";

export function CategoryCardHeader({ name, activeTab, displayBalance }) {
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
      <div className="relative">
        <h1 className="z-50 font-bold">{cap(name)}</h1>
      </div>
      <div className="flex flex-row justify-center items-center gap-1">
        <h2 className="text-sm font-medium relative z-50 text-color-dark-blue">
          {cap(categoryName)}
        </h2>
        <h2 className="text-sm">{toDollars(displayBalance)}</h2>
      </div>
    </div>
  );
}
