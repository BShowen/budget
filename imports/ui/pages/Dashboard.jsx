import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";
import { IncomeEnvelope } from "../components/IncomeEnvelope";
import { SavingsEnvelope } from "../components/SavingsEnvelope";
import { AddEnvelopeButton } from "../components/AddEnvelopeButton";

export const Dashboard = () => {
  const { budget } = useTracker(() => {
    // BudgetCollection will never contain more than one document.
    // This is on purpose because the budget publication returns one document.
    const budget = BudgetCollection.findOne();
    return {
      budget,
    };
  });

  const { envelopes, incomeEnvelope, savingsEnvelope } = useTracker(() => {
    if (!budget) {
      return { envelopes: [], incomeEnvelope: {} };
    }
    // Get the envelopes for this budget.
    const allEnvelopes = EnvelopeCollection.find({
      budgetId: budget._id,
    }).fetch();

    const { envelopes, incomeEnvelope, savingsEnvelope } = allEnvelopes.reduce(
      (acc, envelope) => {
        if (envelope.isIncomeEnvelope) {
          return { ...acc, incomeEnvelope: { ...envelope } };
        } else if (envelope.isSavingsEnvelope) {
          return { ...acc, savingsEnvelope: { ...envelope } };
        } else {
          return { ...acc, envelopes: [...acc.envelopes, envelope] };
        }
      },
      { envelopes: [], incomeEnvelope: {}, savingsEnvelope: {} }
    );
    return {
      envelopes,
      incomeEnvelope,
      savingsEnvelope,
    };
  });
  const [activeTab, setActiveTab] = useState("planned"); // "planned", "spent", "remaining"

  return (
    <div className="w-full pb-12 flex flex-col items-stretch gap-5 relative z-0">
      <DashboardHeader
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        date={budget.createdAt}
        incomeEnvelope={incomeEnvelope}
        nonIncomeEnvelopes={envelopes}
      />

      <div className="mt-40 pb-16 px-2 flex flex-col items-stretch gap-4 z-0">
        {/* Categories container */}

        <IncomeEnvelope
          key={incomeEnvelope._id}
          {...incomeEnvelope}
          activeTab={activeTab}
        />

        <SavingsEnvelope
          key={savingsEnvelope._id}
          {...savingsEnvelope}
          activeTab={activeTab}
        />

        {envelopes.map((envelope) => (
          <Envelope key={envelope._id} {...envelope} activeTab={activeTab} />
        ))}
        <AddEnvelopeButton budgetId={budget._id} />
      </div>
    </div>
  );
};
