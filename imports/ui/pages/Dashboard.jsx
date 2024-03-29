import React, { useContext, useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Context
import { RootContext } from "../layouts/AppData";

// Collections
import { BudgetCollection } from "../../api/Budget/BudgetCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";

// Components
import { CategoryEnvelope } from "../components/envelopes/CategoryEnvelope";
import { IncomeEnvelope } from "../components/envelopes/IncomeEnvelope";
import { SavingsEnvelope } from "../components/envelopes/SavingsEnvelope";
import { DashboardHeader } from "../components/dashboardComponents/DashboardHeader";
import { NewEnvelopeButton } from "../components/dashboardComponents/DashboardNewEnvelopeButton";
import { WelcomeComponent } from "../components/dashboardComponents/WelcomeComponent";

export const Dashboard = () => {
  const { currentBudgetId } = useContext(RootContext);
  const budget = useTracker(() =>
    BudgetCollection.findOne({ _id: currentBudgetId })
  );

  const { expenseEnvelopes, incomeEnvelope, savingsEnvelope } = useTracker(
    () => {
      const envelopes = {
        expenseEnvelopes: [],
        incomeEnvelope: {},
        savingsEnvelope: {},
        allocationEnvelope: {},
      };
      // If no budget is loaded, return blank envelopes.
      if (!budget) return envelopes;

      // Get the envelopes for this budget.
      const allEnvelopes = EnvelopeCollection.find({
        budgetId: budget._id,
      }).fetch();

      // Categorize and return the envelopes.
      return allEnvelopes.reduce((acc, envelope) => {
        switch (envelope.kind) {
          case "income":
            return { ...acc, incomeEnvelope: { ...envelope } };
          case "savings":
            return { ...acc, savingsEnvelope: { ...envelope } };
          case "allocation":
            return { ...acc, allocationEnvelope: { ...envelope } };
          case "expense":
            return {
              ...acc,
              expenseEnvelopes: [...acc.expenseEnvelopes, envelope],
            };
        }
      }, envelopes);
    }
  );
  const [activeTab, setActiveTab] = useState(
    window.localStorage.getItem("activeTab") || "planned"
  ); // "planned", "spent", "remaining"

  useEffect(() => {
    // Persist the users activeTab selection.
    window.localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="w-full pb-12 flex flex-col items-stretch gap-5 relative z-0">
      <DashboardHeader
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        date={budget.createdAt}
        incomeEnvelope={incomeEnvelope}
      />

      <div className="mt-[105px] pb-16 px-2 flex flex-col items-stretch gap-4 z-0">
        <WelcomeComponent incomeEnvelope={incomeEnvelope} />
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

        {/* Allocation envelope will go here.  */}

        {expenseEnvelopes.map((envelope) => (
          <CategoryEnvelope
            key={envelope._id}
            {...envelope}
            activeTab={activeTab}
          />
        ))}
        <NewEnvelopeButton budgetId={budget._id} />
      </div>
    </div>
  );
};
