import React from "react";

// Components
import { CategoryCard } from "./categoryComponents/CategoryCard";

// Hooks
import { useSavingsCategory } from "../../hooks/useSavingsCategory";
export const SavingsCategory = ({ _id, name, activeTab }) => {
  const { ledgerList, displayBalance } = useSavingsCategory({
    envelopeId: _id,
    activeTab,
  });
  return (
    <CategoryCard
      name={name}
      activeTab={activeTab}
      displayBalance={displayBalance}
      ledgerList={ledgerList}
      envelopeId={_id}
    />
  );
};
