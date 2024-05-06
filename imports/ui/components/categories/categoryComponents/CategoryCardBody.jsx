import React from "react";

// Components
import { IncomeLedger } from "../../ledgers/IncomeLedger";
import { ExpenseLedger } from "../../ledgers/ExpenseLedger";
import { SavingsLedger } from "../../ledgers/SavingsLedger";

export function CategoryCardBody({ ledgers, activeTab, kind }) {
  switch (kind) {
    case "income":
      return <IncomeLedgers ledgers={ledgers} activeTab={activeTab} />;
    case "expense":
      return <ExpenseLedgers ledgers={ledgers} activeTab={activeTab} />;
    case "savings":
      return <SavingsLedgers ledgers={ledgers} activeTab={activeTab} />;
  }
}

function IncomeLedgers({ ledgers, activeTab }) {
  return (
    <div className="envelope-body">
      {ledgers.map((ledger) => (
        <IncomeLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
    </div>
  );
}
function ExpenseLedgers({ ledgers, activeTab }) {
  return (
    <div className="envelope-body">
      {ledgers.map((ledger) => (
        <ExpenseLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
    </div>
  );
}
function SavingsLedgers({ ledgers, activeTab }) {
  return (
    <div className="envelope-body">
      {ledgers.map((ledger) => (
        <SavingsLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
    </div>
  );
}
