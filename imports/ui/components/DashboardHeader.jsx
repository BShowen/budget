import React, { useContext } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";

// Icons
import { IoPersonCircleSharp } from "react-icons/io5";
import { TfiAngleDown } from "react-icons/tfi";

// Components
import { DashboardButtonGroup } from "./DashboardButtonGroup";
import { BudgetDate } from "./BudgetDate";

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
  const { setDate } = useContext(RootContext);

  return (
    // This container needs to be position: fixed instead of sticky otherwise
    // iOS - Safari will flicker this element on page load.
    <div className="fixed top-0 lg:w-3/5 mx-auto z-50 w-full flex flex-col justify-start items-stretch shadow-md">
      <div className="bg-sky-500 px-2 pb-4 z-50 shadow-sm">
        <div className="w-full flex flex-row flex-nowrap items-center justify-between">
          <div className="flex flex-row justify-center items-center">
            <BudgetDate date={date} />
            <TfiAngleDown className="text-white text-3xl lg:hover:cursor-pointer" />
          </div>
          <IoPersonCircleSharp className="text-5xl me-2 text-sky-700" />
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
      return ledger.startingBalance + total;
    }, 0);
  });

  const totalIncomeBudgeted = useTracker(() => {
    const ledgers = LedgerCollection.find({
      envelopeId: { $ne: incomeEnvelope._id },
    }).fetch();
    return ledgers.reduce((total, ledger) => {
      return ledger.startingBalance + total;
    }, 0);
  });

  // income: Month-to-date money tracked as "income" in a non-income envelope.
  // i.e. refunds for purchase
  // expense: Month-to-date money tracked as an expense. i.e. purchases.
  // const { income, expense } = useTracker(() => {
  //   const transactions = TransactionCollection.find({
  //     envelopeId: { $ne: incomeEnvelope._id },
  //   }).fetch();
  //   return reduceTransactions({ transactions });
  // });
  // const leftToSpend = expectedMonthlyIncome - expense + income;

  const displayBalance = toDollars(
    Math.abs(expectedMonthlyIncome - totalIncomeBudgeted)
  );

  const isOverBudget = expectedMonthlyIncome - totalIncomeBudgeted < 0;

  return (
    <div className="w-full h-8 bg-white flex flex-row flex-nowrap justify-center items-center text-slate-600">
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
