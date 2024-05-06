import React from "react";

// Components
import { CategoryCard } from "./categoryComponents/CategoryCard";

// Hooks
import { useExpenseCategory } from "../../hooks/useExpenseCategory";

export const ExpenseCategory = ({ _id, name, activeTab }) => {
  const { ledgerList, displayBalance, kind } = useExpenseCategory({
    envelopeId: _id,
    activeTab,
  });

  return (
    <CategoryCard
      name={name}
      activeTab={activeTab}
      displayBalance={{ value: displayBalance, text: activeTab }}
      ledgerList={ledgerList}
      envelopeId={_id}
      kind={kind}
    />
  );
};
