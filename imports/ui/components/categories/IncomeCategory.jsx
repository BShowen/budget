import React from "react";

// Components
import { CategoryCard } from "./categoryComponents/CategoryCard";

// Hooks
import { useIncomeCategory } from "../../hooks/useIncomeCategory";

export const IncomeCategory = ({ _id, name, activeTab }) => {
  const { displayBalance, ledgerList, kind } = useIncomeCategory({
    envelopeId: _id,
    activeTab,
  });

  const activeTabText =
    activeTab == "planned"
      ? "planned"
      : activeTab == "spent"
      ? "income received"
      : "left to receive";

  return (
    <CategoryCard
      name={name}
      activeTab={activeTab}
      displayBalance={{ value: displayBalance, text: activeTabText }}
      ledgerList={ledgerList}
      envelopeId={_id}
      kind={kind}
    />
  );
};
