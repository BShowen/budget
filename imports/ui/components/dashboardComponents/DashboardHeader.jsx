import React, { useContext } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../../api/Ledger/LedgerCollection";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { MonthSelector } from "./MonthSelector";

// Utils
import { toDollars } from "../../util/toDollars";

export function DashboardHeader({
  setActiveTab,
  activeTab,
  date,
  incomeEnvelope,
}) {
  const year = date.toLocaleString("en-US", { year: "numeric" });
  const currentMonth = date.toLocaleString("en-US", { month: "long" });

  return (
    <div className="page-header lg:w-3/5 mx-auto z-50 w-full flex flex-col justify-start items-stretch bg-header rounded-b-xl overflow-hidden shadow-sm">
      <div className="pb-2 z-50 shadow-sm text-white">
        <div className="w-full flex flex-row justify-between items-stretch h-14">
          <div className="ms-2 flex flex-row justify-center items-center">
            <img src="/icon.png" width="40px" />
            <div
              className="flex flex-col justify-center items-stretch font-medium
             text-xs"
            >
              <p>Dough</p>
              <p>Tracker</p>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center px-2 gap-2">
            <h1 className="text-3xl font-bold lg:hover:cursor-pointer w-max">
              {currentMonth} <span className="font-extralight">{year}</span>
            </h1>
            <MonthSelector currentDate={date} />
          </div>
        </div>
        <div className="w-full px-1">
          <DashboardButtonGroup
            active={activeTab}
            setActiveTab={(activeTab) => setActiveTab(activeTab)}
          />
        </div>
      </div>
      {/* <RemainingMoneyBanner incomeEnvelope={incomeEnvelope} /> */}
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
      return Math.round((ledger.allocatedAmount + total) * 100) / 100;
    }, 0);
  });

  const displayBalance = toDollars(
    Math.abs(
      Math.round((expectedMonthlyIncome - totalIncomeBudgeted) * 100) / 100
    )
  );

  const isOverBudget =
    Math.round((expectedMonthlyIncome - totalIncomeBudgeted) * 100) / 100 < 0;

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
