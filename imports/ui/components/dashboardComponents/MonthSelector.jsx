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

  function toggleDropdown() {
    setDropdownOpen((prev) => !prev);
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
    <div className="">
      <IoIosArrowDropdown
        className={`text-3xl transition-all duration-300 ease-in-out ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
        onClick={toggleDropdown}
      />
      {isDropdownOpen && (
        <div className="z-50 text-color-primary flex flex-row items-stretch absolute top-14 left-0 right-0 h-[85px] bg-white">
          <ul className="list-none w-full flex flex-row justify-start items-center gap-2 overflow-y-hidden overflow-x-scroll scrollbar-hide px-2 shadow-md">
            {budgetList.map((budget) => {
              const active =
                currentDate.getTime() == budget.createdAt.getTime();
              const element = (
                <li
                  key={budget._id}
                  className="max-w-24 min-w-24 h-14"
                  id={active ? "active" : undefined}
                >
                  <button
                    className={`w-full h-full rounded-lg border p-1 ${
                      active
                        ? "bg-color-light-blue text-white border-color-dark-blue"
                        : "bg-app text-color-primary"
                    }`}
                    type="button"
                    onClick={() => goToBudget({ date: budget.createdAt })}
                  >
                    <p className="font-semibold">
                      {dates.format(budget.createdAt, { forPageHeader: true })}
                    </p>
                  </button>
                </li>
              );
              return element;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
