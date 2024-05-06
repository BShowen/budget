import React from "react";

// Components
import { CategoryCardHeader } from "./CategoryCardHeader";
import { CategoryCardBody } from "./CategoryCardBody";
import { CategoryCardFooter } from "./CategoryCardFooter";

export function CategoryCard({
  name,
  activeTab,
  displayBalance,
  ledgerList,
  envelopeId,
}) {
  return (
    // Envelope container
    <div className="envelope">
      <CategoryCardHeader
        name={name}
        activeTab={activeTab}
        displayBalance={displayBalance}
        envelopeId={envelopeId}
      />
      <CategoryCardBody ledgers={ledgerList} activeTab={activeTab} />
      <CategoryCardFooter envelopeId={envelopeId} />
    </div>
  );
}
