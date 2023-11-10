import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";

// Components
import { DashboardHeader } from "../components/DashboardHeader";
import { Envelope } from "../components/Envelope";
import { IncomeEnvelope } from "../components/IncomeEnvelope";
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

  const { envelopes, incomeEnvelopes } = useTracker(() => {
    if (!budget) {
      return { envelopes: {} };
    }
    // Get the envelopes for this budget.
    const allEnvelopes = EnvelopeCollection.find({
      budgetId: budget._id,
    }).fetch();

    const { envelopes, incomeEnvelopes } = allEnvelopes.reduce(
      (acc, curr) => {
        if (curr.isIncomeEnvelope) {
          return { ...acc, incomeEnvelopes: [...acc.incomeEnvelopes, curr] };
        } else {
          return { ...acc, envelopes: [...acc.envelopes, curr] };
        }
      },
      { envelopes: [], incomeEnvelopes: [] }
    );
    return {
      envelopes,
      incomeEnvelopes,
    };
  });
  const [activeTab, setActiveTab] = useState("planned"); // "planned", "spent", "remaining"

  return (
    <div className="w-full pb-12">
      <div className="fixed top-0 left-0 right-0 z-50 w-full lg:w-3/5 mx-auto">
        <DashboardHeader
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          date={budget.createdAt}
        />
      </div>

      <div className="pt-32 pb-8 px-2 flex flex-col items-stretch gap-5 z-0">
        {/* Categories container */}

        {incomeEnvelopes.map((envelope) => (
          <IncomeEnvelope
            key={envelope._id}
            {...envelope}
            activeTab={activeTab}
          />
        ))}
        {envelopes.map((envelope) => (
          <Envelope key={envelope._id} {...envelope} activeTab={activeTab} />
        ))}
        <AddEnvelopeButton budgetId={budget._id} />
      </div>
    </div>
  );
};
