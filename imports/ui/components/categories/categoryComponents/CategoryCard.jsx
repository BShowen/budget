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
  kind,
}) {
  return (
    <div className="envelope">
      <CategoryCardHeader
        name={name}
        displayBalance={displayBalance}
        envelopeId={envelopeId}
      />
      <CategoryCardBody
        ledgers={ledgerList}
        activeTab={activeTab}
        kind={kind}
      />
      <CategoryCardFooter envelopeId={envelopeId} />
    </div>
  );
}
