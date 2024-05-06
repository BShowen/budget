import React from "react";

// Components
import { IncomeLedger } from "../../ledgers/IncomeLedger";

export function CategoryCardBody({ ledgers, activeTab }) {
  return (
    <div className="envelope-body">
      {ledgers.map((ledger) => (
        <IncomeLedger key={ledger._id} ledger={ledger} activeTab={activeTab} />
      ))}
    </div>
  );
}
