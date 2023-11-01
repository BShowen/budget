import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useContext, useState } from "react";

// Components
import { Modal } from "./Modal";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TagCollection } from "../../api/Tag/TagCollection";

// Context
import { DashboardContext } from "../pages/Dashboard";

// Utils
import { cap } from ".././util/cap";
import { dates } from "../util/dates";
import { formatDollarAmount } from "../util/formatDollarAmount";

// Icons
import { CgHashtag } from "react-icons/cg";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";

export function TransactionForm({ isOpen, onClose, defaultLedgerSelection }) {
  const { toggleForm } = useContext(DashboardContext);
  const { ledgers } = useTracker(() => {
    // const ledgers = LedgerCollection.find({ budgetId: budgetId }).fetch();
    const ledgers = LedgerCollection.find().fetch();
    return { ledgers };
  });
  const [active, setActiveTab] = useState("expense"); //expense or income
  const [formData, setFormData] = useState({});

  function submit(e) {
    const formData = new FormData(e.target.parentElement.parentElement);
    formData.set("createdAt", `${formData.get("createdAt")}T00:00:00`);
    formData.set("type", active);

    const ledgerId = formData.get("ledgerId");
    const { budgetId, envelopeId } = ledgers.find(
      (ledger) => ledger._id === ledgerId
    );
    formData.set("budgetId", budgetId);
    formData.set("envelopeId", envelopeId);
    const tags = formData.getAll("tags");
    const formDataObject = { ...Object.fromEntries(formData.entries()), tags };
    try {
      Meteor.call("transaction.createTransaction", formDataObject);
    } catch (error) {
      console.log("Error ----> ", error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="overscroll-none bg-slate-100 h-full w-full">
        <div className="w-full bg-sky-500 p-2 flex flex-col justify-start">
          <div className="w-full px-1 py-2 grid grid-cols-12 font-bold text-center">
            <h2 className="col-start-4 col-end-10">Add transaction</h2>
            <h2
              className="col-start-10 col-end-13 text-white"
              onClick={toggleForm}
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
                  defaultValue={dates.format({ forHtml: true })}
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
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="$0.00"
                  required
                  name="amount"
                  id="amount"
                  value={formData.amount || ""}
                  onInput={(e) => {
                    const name = e.target.name;
                    const value = e.target.value;
                    if (name === "amount") {
                      setFormData((prev) => ({
                        ...prev,
                        [name]: formatDollarAmount(value),
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        [name]: value,
                      }));
                    }
                  }}
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
                <TagSelection isOpen={isOpen} />
              </InputContainer>
            </InputGroup>

            <InputGroup>
              <InputContainer options={{ border: false }}>
                <select
                  className="px-0 w-full focus:ring-0 border-0"
                  name="ledgerId"
                  defaultValue={defaultLedgerSelection}
                >
                  {ledgers
                    .sort((a, b) => {
                      return a.name.charCodeAt(0) - b.name.charCodeAt(0);
                    })
                    .map((ledger) => (
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
                  toggleForm();
                }}
                className="inline-block text-center text-green-500 font-bold text-lg"
              >
                Log {active}
              </h2>
            </div>
          </form>
        </div>
      </div>
    </Modal>
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

function TagSelection({ isOpen }) {
  const { tags } = useTracker(() => {
    if (!Meteor.userId() || !isOpen) return {};
    const tags = TagCollection.find(
      {
        accountId: Meteor.user().accountId,
      },
      { sort: { name: 1 } }
    ).fetch();
    return { tags };
  });
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={`w-full flex flex-col gap-2 justify-start overflow-hidden ${
        expanded ? "h-auto" : "h-10"
      }`}
    >
      <div
        className="w-full flex flex-row justify-between items-center h-full"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <CgHashtag className="text-lg text-gray-700" />
          <p className="font-semibold">Tags</p>
        </div>
        <div className="w-7 h-7 lg:hover:cursor-pointer flex flex-row justify-center items-center text-xl">
          {expanded ? (
            <TfiAngleUp className="text-inherit" />
          ) : (
            <TfiAngleDown className="text-inherit" />
          )}
        </div>
      </div>
      {expanded && (
        <div className="w-full flex flex-row flex-wrap gap-2 flex-start items-center text-grey-700 pb-2">
          {tags.map((tag) => (
            <TagInput key={tag._id} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}

function TagInput({ tag }) {
  const [checked, setChecked] = useState(false);
  const toggleChecked = () => setChecked((prev) => !prev);

  return (
    <div
      key={tag._id}
      className={`transition-all duration-75 no-tap-button text-md font-semibold border-2 border-sky-500 px-2 rounded-full min-w-max text-gray-700 ${
        checked ? "bg-sky-500 text-white" : ""
      }`}
      onClick={toggleChecked}
    >
      <p>{cap(tag.name)}</p>
      <input
        className="hidden"
        type="checkbox"
        value={tag._id}
        checked={checked}
        onChange={toggleChecked}
        name="tags"
      />
    </div>
  );
}
