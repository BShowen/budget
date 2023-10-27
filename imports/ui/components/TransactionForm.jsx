import { Meteor } from "meteor/meteor";
import React, { useContext, useState } from "react";

// Context
import { DashboardContext } from "../pages/Dashboard";

// Utils
import { cap } from ".././util/cap";

export function TransactionForm({ ledgers, budgetId }) {
  const [active, setActiveTab] = useState("expense"); //expense or income
  const { toggleModal } = useContext(DashboardContext);

  function submit(e) {
    const formData = new FormData(e.target.parentElement.parentElement);
    formData.set("createdAt", `${formData.get("createdAt")}T00:00:00`);
    formData.set("type", active);
    try {
      Meteor.call(
        "transaction.createTransaction",
        Object.fromEntries(formData.entries())
      );
    } catch (error) {
      console.lgo("Error ----> ", error);
    }
  }

  return (
    <div>
      <div className="w-full bg-sky-500 p-2 flex flex-col justify-start">
        <div className="w-full px-1 py-2 grid grid-cols-12 font-bold text-center">
          <h2 className="col-start-4 col-end-10">Add transaction</h2>
          <h2
            className="col-start-10 col-end-13 text-white"
            onClick={toggleModal}
          >
            Cancel
          </h2>
        </div>
        <ButtonGroup active={active} setActiveTab={setActiveTab} />
      </div>
      <div className="bg-slate-100 p-3">
        <form className="flex flex-col justify-start gap-2">
          <InputGroup>
            <InputContainer>
              <label className="w-1/2" htmlFor="date">
                <p className="font-semibold">Date</p>
              </label>
              <input
                type="date"
                name="createdAt"
                required
                id="date"
                className="px-0 w-1/2 focus:ring-0 border-0"
              />
            </InputContainer>
            <InputContainer>
              <label className="w-1/2" htmlFor="amount">
                <p className="font-semibold">Amount</p>
              </label>
              <input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="$0.00"
                required
                name="amount"
                id="amount"
                min={0}
                className="px-0 w-1/2 text-end focus:ring-0 border-0"
              />
            </InputContainer>
            <InputContainer options={{ border: false }}>
              <label className="w-1/2" htmlFor="merchant">
                <p className="font-semibold">
                  {active === "expense" ? "Merchant" : "Source"}
                </p>
              </label>
              <input
                type="text"
                placeholder="Name"
                required
                id="merchant"
                name="merchant"
                className="px-0 w-1/2 text-end focus:ring-0 border-0"
              />
            </InputContainer>
          </InputGroup>
          <InputGroup>
            <InputContainer options={{ border: false }}>
              <select
                className="px-0 w-full focus:ring-0 border-0"
                name="ledgerId"
              >
                {ledgers.map((ledger) => (
                  <option key={ledger._id} value={ledger._id}>
                    {ledger.name}
                  </option>
                ))}
              </select>
            </InputContainer>
          </InputGroup>
          <InputGroup>
            <InputContainer options={{ border: false }}>
              <input
                type="text"
                placeholder="Add a note"
                name="note"
                className="px-0 text-left w-full focus:ring-0 border-0"
              />
            </InputContainer>
          </InputGroup>
          <div className="flex flex-row justify-center items-center w-full p-2 pb-14">
            <h2
              onClick={(e) => {
                submit(e);
                toggleModal();
              }}
              className="inline-block text-center text-green-500 font-bold text-lg"
            >
              Log {active}
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputContainer({ children, options = {} }) {
  const { border } = { border: true, ...options };
  return (
    <div
      className={`w-full ${
        border ? "border-b" : ""
      } flex flex-row items-center`}
    >
      {children}
    </div>
  );
}

function InputGroup({ children }) {
  return (
    <div className="bg-white rounded-lg flex flex-col justify-start items-center px-4">
      {children}
    </div>
  );
}

function ButtonGroup({ active, setActiveTab }) {
  const slugList = ["expense", "income"];
  const buttonList = slugList.map((btnText) => (
    <div
      key={btnText}
      onClick={setActiveTab.bind(null, btnText)}
      className="basis-0 grow text-white font-bold flex flex-row justify-center items-center md:hover:cursor-pointer"
    >
      <h2>{cap(btnText)}</h2>
    </div>
  ));

  const index = slugList.indexOf(active);

  return (
    <div className="w-full flex flex-row justify-start p-1 bg-sky-700 rounded-md h-9 relative z-0">
      <Slider index={index} />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-row flex-nowrap z-3">
        {buttonList}
      </div>
    </div>
  );
}

function Slider({ index }) {
  const position = index === 0 ? "left-0" : "left-2/4";
  return (
    <div
      className={`${position} w-2/4 relative z-2 h-7 rounded-md bg-sky-500 transition-all duration-250`}
    />
  );
}
