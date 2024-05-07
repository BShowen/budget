import React from "react";

// Components
import { IncomeLedger } from "../../ledgers/IncomeLedger";
import { ExpenseLedger } from "../../ledgers/ExpenseLedger";
import { SavingsLedger } from "../../ledgers/SavingsLedger";
import { CategoryCardForm } from "./CategoryCardForm";

export function CategoryCardBody({ ledgers, activeTab, kind, envelopeId }) {
  return (
    <div className="flex flex-col gap-[5px] z-20">
      {(() => {
        switch (kind) {
          case "income":
            return ledgers.map((ledger) => (
              <IncomeLedger
                key={ledger._id}
                ledger={ledger}
                activeTab={activeTab}
              />
            ));
          case "expense":
            return ledgers.map((ledger) => (
              <ExpenseLedger
                key={ledger._id}
                ledger={ledger}
                activeTab={activeTab}
              />
            ));
          case "savings":
            return ledgers.map((ledger) => (
              <SavingsLedger
                key={ledger._id}
                ledger={ledger}
                activeTab={activeTab}
              />
            ));
        }
      })()}
      <CategoryCardForm envelopeId={envelopeId} />
    </div>
  );
}
