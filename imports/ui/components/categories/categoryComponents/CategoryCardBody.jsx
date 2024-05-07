import React from "react";

// Components
import { IncomeLedger } from "../../ledgers/IncomeLedger";
import { ExpenseLedger } from "../../ledgers/ExpenseLedger";
import { SavingsLedger } from "../../ledgers/SavingsLedger";
import { CategoryCardForm } from "./CategoryCardForm";

export function CategoryCardBody({ ledgers, activeTab, kind, envelopeId }) {
  switch (kind) {
    case "income":
      return (
        <IncomeLedgers
          ledgers={ledgers}
          activeTab={activeTab}
          envelopeId={envelopeId}
        />
      );
    case "expense":
      return (
        <ExpenseLedgers
          ledgers={ledgers}
          activeTab={activeTab}
          envelopeId={envelopeId}
        />
      );
    case "savings":
      return (
        <SavingsLedgers
          ledgers={ledgers}
          activeTab={activeTab}
          envelopeId={envelopeId}
        />
      );
  }
}

function IncomeLedgers({ ledgers, activeTab, envelopeId }) {
  return (
    <div className="category-card-body">
      {ledgers.map((ledger) => (
        <IncomeLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
      <CategoryCardForm envelopeId={envelopeId} />
    </div>
  );
}
function ExpenseLedgers({ ledgers, activeTab, envelopeId }) {
  return (
    <div className="category-card-body">
      {ledgers.map((ledger) => (
        <ExpenseLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
      <CategoryCardForm envelopeId={envelopeId} />
    </div>
  );
}
function SavingsLedgers({ ledgers, activeTab, envelopeId }) {
  return (
    <div className="category-card-body">
      {ledgers.map((ledger) => (
        <SavingsLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
      <CategoryCardForm envelopeId={envelopeId} />
    </div>
  );
}
