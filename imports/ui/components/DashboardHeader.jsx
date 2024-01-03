import React, { useContext } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";

// Utils
import { toDollars } from "../util/toDollars";

// Context
import { RootContext } from "../pages/AppData";

export function DashboardHeader({
  setActiveTab,
  activeTab,
  date,
  incomeEnvelope,
}) {
  const { goPreviousMonth, goNextMonth } = useContext(RootContext);

  const prevDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const prevMonth = prevDate.toLocaleDateString("en-US", { month: "long" });

  const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const nextMonth = nextDate.toLocaleDateString("en-US", { month: "long" });

  const year = date.toLocaleString("en-US", { year: "numeric" });
  const currentMonth = date.toLocaleString("en-US", { month: "long" });

  return (
    <div className="page-header lg:w-3/5 mx-auto z-50 w-full flex flex-col justify-start items-stretch shadow-sm bg-header ">
      <div className="pb-4 z-50 shadow-sm text-white">
        <div className="w-full flex flex-row flex-nowrap items-center justify-center">
          {/* months */}
          <div className="flex flex-row justify-center items-center shrink basis-1/3">
            <h1
              onClick={goPreviousMonth}
              className="text-lg font-semibold lg:hover:cursor-pointer w-min"
            >
              {prevMonth}
            </h1>
          </div>
          <div className="flex flex-col items-center grow basis-1/3">
            <h1 className="text-3xl font-bold lg:hover:cursor-pointer w-min">
              {currentMonth}
            </h1>
            <p className="text-sm font-semibold">{year}</p>
          </div>
          <div className="flex flex-row justify-center items-center shrink basis-1/3">
            <h1
              onClick={goNextMonth}
              className="text-lg font-semibold lg:hover:cursor-pointer w-min"
            >
              {nextMonth}
            </h1>
          </div>
        </div>
        <div className="w-full px-1">
          <DashboardButtonGroup
            active={activeTab}
            setActiveTab={(activeTab) => setActiveTab(activeTab)}
          />
        </div>
      </div>
      <RemainingMoneyBanner incomeEnvelope={incomeEnvelope} />
    </div>
  );
}

function RemainingMoneyBanner({ incomeEnvelope }) {
  const expectedMonthlyIncome = useTracker(() => {
    const ledgers = LedgerCollection.find({
      envelopeId: incomeEnvelope._id,
    }).fetch();

    return ledgers.reduce((total, ledger) => {
      return ledger.allocatedAmount + total;
    }, 0);
  });

  const totalIncomeBudgeted = useTracker(() => {
    const ledgers = LedgerCollection.find({
      envelopeId: { $ne: incomeEnvelope._id },
    }).fetch();
    return ledgers.reduce((total, ledger) => {
      return ledger.allocatedAmount + total;
    }, 0);
  });

  const displayBalance = toDollars(
    Math.abs(expectedMonthlyIncome - totalIncomeBudgeted)
  );

  const isOverBudget = expectedMonthlyIncome - totalIncomeBudgeted < 0;

  return (
    <div className="w-full h-8 bg-white flex flex-row flex-nowrap justify-center items-center">
      <p>
        {isOverBudget ? (
          <>
            <span className="font-bold text-rose-500">{displayBalance}</span>{" "}
            <span className="text-sm font-medium">over budget</span>
          </>
        ) : (
          <>
            <span className="font-bold">{displayBalance}</span>{" "}
            <span className="text-sm font-medium">left to budget</span>
          </>
        )}
      </p>
    </div>
  );
}
