import React, { useContext, useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
// Icons
import { IoIosArrowDropdown } from "react-icons/io";

// Context
import { RootContext } from "../../layouts/App";

// Collections
import { BudgetCollection } from "../../../api/Budget/BudgetCollection";

// Util
import { dates } from "../../util/dates";

export function MonthSelector({ currentDate }) {
  const budgetDateList = useTracker(() => {
    const budgetDates = BudgetCollection.find({}, { sort: { createdAt: 1 } })
      .fetch()
      .reduce((acc, budget) => [...acc, budget.createdAt], []);

    // If the latestBudgetDate is greater than todays date, then don't add a new date to the list.
    // If the latestBudgetDate is less than todays date, then add a new date to the list.
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const latestBudgetDate = budgetDates[budgetDates.length - 1];
    if (latestBudgetDate.getTime() <= today.getTime()) {
      budgetDates.push(
        new Date(
          latestBudgetDate.getFullYear(),
          latestBudgetDate.getMonth() + 1,
          1
        )
      );
    }
    return budgetDates;
  });

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  function toggleDropdown() {
    setDropdownOpen((prev) => !prev);
    setCanAnimate(true);
  }

  const { goToBudget } = useContext(RootContext);

  // Scroll the active month into view
  useEffect(() => {
    if (isDropdownOpen) {
      document
        .getElementById("active")
        .scrollIntoView({ behavior: "instant", inline: "center" });
    }
  }, [isDropdownOpen]);

  return (
    <div>
      <IoIosArrowDropdown
        className={`text-2xl transition-all duration-300 ease-in-out ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
        onClick={toggleDropdown}
      />

      <div
        className={`z-50 text-color-primary flex flex-row items-center absolute left-0 right-0 bg-white mt-2 rounded-b-lg shadow-inner ${
          isDropdownOpen
            ? "month-selector-slide-in"
            : canAnimate
            ? "month-selector-slide-out"
            : "h-0"
        }`}
      >
        <ul className="list-none w-full flex flex-row justify-start items-center gap-2 overflow-y-hidden overflow-x-scroll scrollbar-hide px-2 h-full overscroll-x-contain">
          {budgetDateList.map((date, i) => {
            const isLastElement = budgetDateList.length - 1 == i;
            return (
              <MonthSelectorButton
                key={date.getTime()}
                clickHandler={goToBudget}
                activeBudgetDate={currentDate}
                budgetDate={date}
                isFutureDate={isLastElement}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function MonthSelectorButton({
  clickHandler,
  activeBudgetDate,
  budgetDate,
  isFutureDate,
}) {
  const active = activeBudgetDate.getTime() == budgetDate.getTime();
  const activeStyling = isFutureDate
    ? "bg-app border-2 border-color-light-blue border-dashed text-primary"
    : active
    ? "bg-color-light-blue text-white"
    : "bg-app text-color-primary";
  return (
    <li
      className="min-w-max h-8 drop-shadow-sm"
      id={active ? "active" : undefined}
    >
      <button
        className={`w-full h-full rounded-lg p-1 flex flex-row justify-center items-center ${activeStyling}`}
        type="button"
        onClick={() => clickHandler({ date: budgetDate })}
      >
        <p className="font-semibold">
          {dates.format(budgetDate, { forPageHeader: true })}
        </p>
      </button>
    </li>
  );
}
