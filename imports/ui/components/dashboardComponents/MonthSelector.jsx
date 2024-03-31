import React, { useContext, useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
// Icons
import { IoIosArrowDropdown } from "react-icons/io";

// Context
import { RootContext } from "../../layouts/AppData";

// Collections
import { BudgetCollection } from "../../../api/Budget/BudgetCollection";

// Util
import { dates } from "../../util/dates";

export function MonthSelector({ currentDate }) {
  const budgetList = useTracker(() => {
    const budgets = BudgetCollection.find(
      {},
      { sort: { createdAt: 1 } }
    ).fetch();
    return budgets;
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
          {budgetList.map((budget) => (
            <MonthSelectorButton
              key={budget._id}
              onClickHandler={goToBudget}
              currentDate={currentDate}
              budget={budget}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function MonthSelectorButton({ onClickHandler, currentDate, budget }) {
  const active = currentDate.getTime() == budget.createdAt.getTime();
  return (
    <li
      key={budget._id}
      className="min-w-max h-8 drop-shadow-sm"
      id={active ? "active" : undefined}
    >
      <button
        className={`w-full h-full rounded-lg p-1 ${
          active
            ? "bg-color-light-blue text-white"
            : "bg-app text-color-primary"
        }`}
        type="button"
        onClick={() => onClickHandler({ date: budget.createdAt })}
      >
        <p className="font-semibold">
          {dates.format(budget.createdAt, { forPageHeader: true })}
        </p>
      </button>
    </li>
  );
}
