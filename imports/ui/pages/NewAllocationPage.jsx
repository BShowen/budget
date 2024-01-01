import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

// Utils
import { dates } from "../util/dates";
import { formatDollarAmount } from "../util/formatDollarAmount";

// Icons
import { IoIosArrowBack } from "react-icons/io";

// Context
import { RootContext } from "../pages/AppData";
export function NewAllocationPage() {
  const navigate = useNavigate();
  const { currentBudgetId } = useContext(RootContext);
  const [formData, setFormData] = useState({
    name: "",
    goalAmount: "",
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
            className="form-input"
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
            className="form-input"
          />
          <div>
            <label htmlFor="goalDate">Goal date</label>
            <input
              className="form-input"
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
      if (name == "goalAmount") {
        return { ...prev, [name]: formatDollarAmount(value) };
      } else {
        return { ...prev, [name]: value };
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    Meteor.call(
      "ledger.createAllocationLedger",
      { ...formData, budgetId: currentBudgetId },
      (err, result) => {
        if (err) {
          console.log("Error:", err);
        } else {
          navigate(-1);
        }
      }
    );
  }
}

function PageHeader() {
  const navigate = useNavigate();
  return (
    <div className="page-header w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-sky-500 shadow-sm text-white">
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
