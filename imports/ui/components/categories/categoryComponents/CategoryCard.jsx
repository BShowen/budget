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
    <div className="category-card">
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
