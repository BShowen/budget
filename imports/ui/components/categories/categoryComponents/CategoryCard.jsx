import React from "react";

// Components
import { CategoryCardHeader } from "./CategoryCardHeader";
import { CategoryCardBody } from "./CategoryCardBody";

export function CategoryCard({
  name,
  activeTab,
  displayBalance,
  ledgerList,
  envelopeId,
  kind,
}) {
  return (
    <div className="rounded-xl flex flex-col items-stretch relative z-0 overflow-hidden bg-white dark:bg-dark-mode-bg-1 shadow-sm dark:shadow-none py-1 px-2">
      <CategoryCardHeader
        name={name}
        displayBalance={displayBalance}
        envelopeId={envelopeId}
      />
      <CategoryCardBody
        ledgers={ledgerList}
        activeTab={activeTab}
        kind={kind}
        envelopeId={envelopeId}
      />
    </div>
  );
}
