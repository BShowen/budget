import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TagCollection } from "../../api/Tag/TagCollection";

// Utils
import { cap } from ".././util/cap";
import { dates } from "../util/dates";
import { formatDollarAmount } from "../util/formatDollarAmount";

// Icons
import { CgHashtag } from "react-icons/cg";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { AiOutlinePlusCircle } from "react-icons/ai";

export function TransactionForm() {
  const navigate = useNavigate();
  const { ledgerId } = useParams();
  const { ledgers } = useTracker(() => {
    const ledgers = LedgerCollection.find().fetch();
    return { ledgers };
  });
  const ledger = ledgers.find((ledger) => ledger._id === ledgerId);

  const [active, setActiveTab] = useState(
    ledger.isIncomeLedger ? "income" : "expense"
  ); //expense or income
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
    const newTags = formData.getAll("newTags");
    const formDataObject = {
      ...Object.fromEntries(formData.entries()),
      tags,
      newTags,
    };
    try {
      Meteor.call("transaction.createTransaction", formDataObject);
      navigate(-1);
    } catch (error) {
      console.log("Error ----> ", error);
    }
  }

  return (
    <div className="bg-slate-100 h-full w-full">
      <div className="w-full bg-sky-500 p-2 flex flex-col justify-start">
        <div className="w-full px-1 py-2 grid grid-cols-12 font-bold text-center">
          <h2 className="col-start-4 col-end-10">
            {ledger.isIncomeLedger ? "Add income" : "Add transaction"}
          </h2>
          <h2
            className="col-start-10 col-end-13 text-white lg:hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </h2>
        </div>

        <ButtonGroup
          active={active}
          setActiveTab={setActiveTab}
          disableChange={ledger.isIncomeLedger}
        />
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
              <TagSelection />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <InputContainer options={{ border: false }}>
              <select
                className="px-0 w-full focus:ring-0 border-0"
                name="ledgerId"
                defaultValue={ledgerId}
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
              onClick={submit}
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

function ButtonGroup({ active, setActiveTab, disableChange }) {
  const slugList = ["expense", "income"];
  const buttonList = slugList.map((btnText) => {
    const isDisabled = disableChange ? btnText != active : false;
    return (
      <button
        key={btnText}
        onClick={isDisabled ? () => {} : setActiveTab.bind(null, btnText)}
        className={`basis-0 grow text-white font-bold flex flex-row justify-center items-center ${
          isDisabled ? "md:hover:cursor-not-allowed" : "md:hover:cursor-pointer"
        }`}
      >
        <h2>{cap(btnText)}</h2>
      </button>
    );
  });

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

function TagSelection() {
  const { tags } = useTracker(() => {
    if (!Meteor.userId()) return {};
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
      className={`w-full flex flex-col gap-2 justify-start overflow-hidden lg:hover:cursor-pointer ${
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
        <div className="w-full flex flex-row flex-nowrap overflow-scroll gap-1 flex-start text-grey-700 mb-2 overscroll-contain scrollbar-hide">
          <CreateTags />
          {tags.map((tag) => (
            <Tag key={tag._id} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}

function Tag({ tag }) {
  const [checked, setChecked] = useState(false);
  const toggleChecked = () => setChecked((prev) => !prev);

  return (
    <div
      className={`transition-all duration-75 no-tap-button text-md font-semibold border-2 border-sky-500 px-2 rounded-md min-w-max text-gray-700 ${
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

function CreateTags() {
  const [newTags, setNewTags] = useState([]);
  const [activeTab, setActiveTab] = useState(false);

  const removeTag = ({ id }) => {
    setNewTags((prev) => prev.filter((tag) => tag.id !== id));
    setActiveTab(false);
  };

  const saveTag = ({ tagName, id }) => {
    if (tagName === "New tag") {
      return;
    }
    const tagExists = newTags.find(
      (tag) => tag.id === id || tag.name === tagName
    );
    if (tagExists) {
      // If the tag already exists in newTabs, then update the tag name.
      setNewTags((prev) =>
        prev.map((tag) => (tag.id === id ? { ...tag, name: tagName } : tag))
      );
    } else {
      // If the tag doesn't exist in newTabs, then add it.
      setNewTags((prev) => [{ name: tagName, id }, ...prev]);
    }

    setActiveTab(false);
  };

  return (
    <div className="flex flex-row flex-no-wrap">
      <div
        className="h-7 w-auto pe-2"
        onClick={() => {
          setActiveTab((prev) => !prev);
        }}
      >
        <AiOutlinePlusCircle className="h-full w-auto text-sky-500" />
      </div>
      <div className="flex flex-row flex-no-wrap gap-1">
        {activeTab && (
          <NewTag
            defaultValue={"New tag"}
            removeTag={removeTag}
            saveTag={saveTag}
            id={Random.id()}
            autoFocus={true}
          />
        )}
        {newTags.map((tag) => (
          <NewTag
            key={tag.id}
            defaultValue={tag.name}
            removeTag={removeTag}
            saveTag={saveTag}
            id={tag.id}
          />
        ))}
      </div>
    </div>
  );
}

function NewTag({ defaultValue, removeTag, saveTag, id, autoFocus }) {
  const pRef = useRef();
  const inputRef = useRef();
  const [tagName, setTagName] = useState(defaultValue || "");
  const [inputWidth, setInputWidth] = useState(96);

  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key;
      if (key.toLowerCase() === "enter") {
        inputRef.current.blur();
      }
    }
    if (inputRef.current) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  const handleInput = (e) => {
    setTagName(e.target.value);
    // setTimeout is needed in order to allow the browser to finish painting
    // before we read the value of the hidden <p> element
    setTimeout(() => {
      if (pRef.current) {
        const pElementWidth = pRef.current.getBoundingClientRect().width;
        const newWidth = pElementWidth > 96 ? pElementWidth + 10 : 96;
        setInputWidth(newWidth);
      }
    }, 0);
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      setTagName(defaultValue);
      removeTag({ id: id }); //This will tell the parent to remove this component.
    } else {
      saveTag({
        tagName,
        id,
      });
    }
  };

  const handleClick = (e) => {
    if (tagName === defaultValue) {
      e.target.setSelectionRange(0, 99999);
    }
  };

  return (
    <div className="no-tap-button text-md font-semibold border-2 border-sky-500 px-2 rounded-md overflow-hidden py-0 bg-sky-500 text-white">
      {/* This hidden p tag gets populated with the value that the user types 
      for the tag name. I use this to get the width of the element and set the 
      width of the input tag. I want the input's width to be dynamic and always
      contain the user's text.  */}
      <p className="fixed invisible" ref={pRef}>
        {tagName}
      </p>
      <input
        ref={inputRef}
        className="focus:ring-0 border-0 m-0 p-0 w-24 h-6 text-center bg-inherit text-inherit transition-width duration-100"
        style={{
          width: `${inputWidth}px`,
        }}
        type="text"
        autoFocus={autoFocus}
        value={tagName}
        onInput={handleInput}
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={handleClick}
      />
      <input
        type="checkbox"
        checked
        readOnly
        className="hidden"
        value={tagName}
        name="newTags"
      />
    </div>
  );
}
