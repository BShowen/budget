import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

// Utils
import { dates } from "../util/dates";
import { formatDollarAmount } from "../util/formatDollarAmount";

// Icons
import { IoIosArrowBack } from "react-icons/io";

// Context
import { RootContext } from "../layouts/AppData";
export function NewAllocationPage() {
  const navigate = useNavigate();
  const { currentBudgetId } = useContext(RootContext);
  const [formData, setFormData] = useState({
    name: "",
    goalAmount: "",
    startingBalance: "",
    endDate: dates.format(new Date(), { forHtml: true }),
  });

  return (
    <div>
      <PageHeader />
      <div className="pt-12 p-2 text-gray-700">
        <div className="h-10 flex flex-col justify-center items-center">
          <h1 className="font-bold text-2xl">Create allocation</h1>
        </div>
        <form
          className="flex flex-col justify-start gap-3 lg:w-2/5 lg:mx-auto"
          onSubmit={handleSubmit}
        >
          <input
            className="form-input app-form-input"
            placeholder="Allocation name"
            type="text"
            name="name"
            value={formData.name}
            onInput={handleChange}
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Goal amount"
            name="goalAmount"
            value={formData.goalAmount.toString()}
            onInput={handleChange}
            min={0}
            className="form-input app-form-input"
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Starting balance (optional)"
            name="startingBalance"
            value={formData.startingBalance.toString()}
            onInput={handleChange}
            min={0}
            className="form-input app-form-input"
          />
          <div>
            <label htmlFor="goalDate">Goal date</label>
            <input
              className="form-input app-form-input"
              type="date"
              name="endDate"
              value={formData.endDate}
              onInput={handleChange}
            />
          </div>
          <button className="btn-primary" type="submit">
            Create allocation
          </button>
        </form>
      </div>
    </div>
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name == "goalAmount" || name == "startingBalance") {
        return { ...prev, [name]: formatDollarAmount(value) };
      } else {
        return { ...prev, [name]: value };
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Set the correct date
    const [year, month, day] = formData.endDate.split("-");
    const formattedDate = new Date(year, month - 1, day);
    Meteor.call(
      "ledger.createAllocationLedger",
      { ...formData, endDate: formattedDate, budgetId: currentBudgetId },
      (err, result) => {
        if (err) {
          console.log("Error:", err);
        } else {
          navigate("/", { replace: true });
        }
      }
    );
  }
}

function PageHeader() {
  const navigate = useNavigate();
  return (
    <div className="page-header w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-header shadow-sm text-white">
      <div className="flex flex-row items-center p-1 h-11">
        <Link
          className="text-xl font-bold flex flex-row justify-start items-center w-24 lg:hover:cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack className="text-2xl" /> Back
        </Link>
      </div>
    </div>
  );
}
