import React from "react";

// Components
import { CategoryCard } from "./categoryComponents/CategoryCard";

// Hooks
import { useSavingsCategory } from "../../hooks/useSavingsCategory";
export const SavingsCategory = ({ _id, name, activeTab, kind }) => {
  const { ledgerList, displayBalance } = useSavingsCategory({
    envelopeId: _id,
    activeTab,
  });

  const activeTabText =
    activeTab == "planned"
      ? "planned to save"
      : activeTab == "spent"
      ? "spent"
      : "left to save";

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
