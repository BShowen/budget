import React from "react";

// Components
import { CategoryCard } from "./categoryComponents/CategoryCard";

// Hooks
import { useExpenseCategory } from "../../hooks/useExpenseCategory";

export const ExpenseCategory = ({ _id, name, activeTab }) => {
  const { ledgerList, displayBalance } = useExpenseCategory({
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
