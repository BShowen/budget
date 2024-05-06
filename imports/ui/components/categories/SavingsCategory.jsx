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
      ? "planned"
      : activeTab == "spent"
      ? "spent"
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
