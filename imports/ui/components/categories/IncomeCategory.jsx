import React from "react";

// Components
import { CategoryCard } from "./categoryComponents/CategoryCard";

// Hooks
import { useIncomeCategory } from "../../hooks/useIncomeCategory";

export const IncomeCategory = ({ _id, name, activeTab }) => {
  const { displayBalance, ledgerList } = useIncomeCategory({
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
