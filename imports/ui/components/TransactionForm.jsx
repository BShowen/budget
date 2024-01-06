import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TagCollection } from "../../api/Tag/TagCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { cap } from ".././util/cap";
import { dates } from "../util/dates";
import { formatDollarAmount } from "../util/formatDollarAmount";

// Icons
import { AiOutlinePlusCircle } from "react-icons/ai";

// App context
import { RootContext } from "../pages/AppData";

export function TransactionForm() {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const rootContext = useContext(RootContext);
  const { currentBudgetId: budgetId } = rootContext;
  const { ledgerId, transactionId } = useParams();

  // Get all the ledgers in this budget. This list is used to populate the
  // form selection
  const { ledgers, ledgerSelection } = useTracker(() => {
    const ledgers = LedgerCollection.find().fetch();

    const ledgerSelection = [
      ...ledgers,
      // This is the selection that a user can select in order to make an
      // uncategorized transaction
      { _id: "uncategorized", name: "uncategorized" },
    ]
      .sort((a, b) => {
        return (
          a.name.toLowerCase().charCodeAt(0) -
          b.name.toLowerCase().charCodeAt(0)
        );
      })
      .map((ledger) => (
        <option key={ledger._id} value={ledger._id}>
          {cap(ledger.name)}
        </option>
      ));
    return { ledgers, ledgerSelection };
  });

  // Find the ledger that this transaction belongs to so I can auto-select it
  // in the form's ledger selection field.
  // ledger is defined if user is editing a previous transaction otherwise it is
  // set to null. If null then set ledger to null.
  const ledger = ledgerId
    ? ledgers.find((ledger) => ledger._id === ledgerId)
    : null;

  // transaction is defined if user is editing a previous transaction otherwise
  // it is set to null
  const transaction = useTracker(() => {
    if (!transactionId) return null;
    const transaction = TransactionCollection.findOne(
      { _id: transactionId },
      { fields: { accountId: 0 } }
    );
    return {
      ...transaction,
      createdAt: dates.format(transaction.createdAt, { forHtml: true }),
    };
  });

  // If user is creating a new transaction and ledger is null then active is
  // set to "expense".
  // If user is  creating a new transaction and ledger is defined then active is
  // set to the type of ledger e.g. "income" or "expense" ledger
  // If user is editing a transaction then ledger is defined and transaction is
  // defined so I set active to "income" if this is an income ledger. If it's
  // not an income ledger then I set active to the type of transaction
  // e.g. "income" or "expense".
  const [active, setActiveTab] = useState(
    ledger
      ? ledger.kind === "income" || ledger.kind === "savings"
        ? "income"
        : (transaction && transaction.type) || "expense"
      : "expense"
  ); //expense or income

  const [formData, setFormData] = useState(
    transaction
      ? {
          ...transaction,
          note: transaction?.note || "",
        }
      : {
          createdAt: dates.format(new Date(), { forHtml: true }),
          ledgerId: ledger?._id || "uncategorized",
          type: "",
          amount: "",
          merchant: "",
          tags: "",
          note: "",
          newTags: "",
          budgetId,
        }
  );

  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        // Close the form when the escape key is pressed
        navigate(-1);
      } else if (key === "enter") {
        // Submit the form when the enter key is pressed
        submit();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [formData]);

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "amount":
        setFormData((prev) => ({
          ...prev,
          [name]: formatDollarAmount(value),
        }));
        break;
      default:
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
  }

  function submit() {
    const form = new FormData(formRef.current);
    const tags = form.getAll("tags");
    const newTags = form.getAll("newTags");
    // If formData.ledgerId is defined and doesn't equal "uncategorized" then
    // envelopeId does not need to be defined because the user is creating an
    // uncategorized transaction.
    const { envelopeId } =
      formData.ledgerId && formData.ledgerId != "uncategorized"
        ? ledgers.find((ledger) => ledger._id === formData.ledgerId)
        : {};
    try {
      // Set the correct date
      const [year, month, day] = formData.createdAt.split("-");
      const formattedDate = new Date(year, month - 1, day);
      const newTransaction = {
        ...formData,
        createdAt: formattedDate,
        tags,
        newTags,
        budgetId,
        envelopeId,
        type: active,
      };

      if (newTransaction.ledgerId == "uncategorized") {
        delete newTransaction.ledgerId;
        delete newTransaction.envelopeId;
      }

      if (formData._id) {
        // update
        Meteor.call("transaction.updateTransaction", newTransaction);
      } else {
        // create
        Meteor.call("transaction.createTransaction", newTransaction);
      }
    } catch (error) {
      console.log("Error ----> ", error);
    }
    navigate(-1);
  }

  function setRange(e) {
    e.target.setSelectionRange(0, 999);
  }

  return (
    <>
      <div className="page-header w-full lg:w-3/5 bg-header p-2 flex flex-col justify-start">
        <div className="w-full px-1 py-2 grid grid-cols-12 font-bold text-center items-center">
          <h2
            className="col-start-1 col-end-4 text-white lg:hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </h2>
          <h2 className="col-start-4 col-end-10 text-white text-xl">
            {ledger?.kind == "income" ? "Add income" : "Add transaction"}
          </h2>
          <h2
            className="col-start-10 col-end-13 text-white lg:hover:cursor-pointer"
            onClick={submit}
          >
            Done
          </h2>
        </div>

        <ButtonGroup
          active={active}
          setActiveTab={setActiveTab}
          disableChange={ledger?.kind === "income"}
        />
      </div>
      <div className="h-full w-full pt-24 p-2">
        <form ref={formRef} className="flex flex-col justify-start gap-2">
          <InputGroup>
            <InputContainer>
              <label className="w-1/2" htmlFor="date">
                <p className="font-semibold">Date</p>
              </label>
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleInputChange}
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
                onFocus={setRange}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="$0.00"
                required
                name="amount"
                id="amount"
                value={formData.amount}
                onInput={handleInputChange}
                min={0}
                // autoFocus only when creating a new transaction
                autoFocus={formData.amount == ""}
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
                onFocus={setRange}
                placeholder="Name"
                required
                id="merchant"
                name="merchant"
                value={formData.merchant}
                onInput={handleInputChange}
                className="px-0 w-1/2 text-end focus:ring-0 border-0"
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <InputContainer options={{ border: false }}>
              <TagSelection
                preSelectedTags={
                  transaction && transaction.tags ? transaction.tags : undefined
                }
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <InputContainer options={{ border: false }}>
              <select
                className="px-0 w-full focus:ring-0 border-0"
                name="ledgerId"
                value={formData.ledgerId}
                onChange={handleInputChange}
              >
                {ledgerSelection}
              </select>
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <InputContainer options={{ border: false }}>
              <textarea
                rows={2}
                placeholder="Add a note"
                value={formData.note}
                onInput={handleInputChange}
                name="note"
                className="px-0 text-left w-full focus:ring-0 border-0"
              />
            </InputContainer>
          </InputGroup>
          {transaction && (
            <div className="flex flex-row justify-center items-center w-full p-2 pb-14">
              <h2
                onClick={() => {
                  navigate(-1);
                  Meteor.call("transaction.deleteTransaction", {
                    transactionId,
                  });
                }}
                className="inline-block text-center text-xl font-bold text-rose-500 lg:hover:cursor-pointer lg:hover:text-rose-600 lg:hover:underline transition-all duration-150"
              >
                Delete transaction
              </h2>
            </div>
          )}
        </form>
      </div>
    </>
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
    <div className="bg-white rounded-lg flex flex-col justify-start items-center px-4 shadow-sm">
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
    <div className="w-full flex flex-row justify-start p-1 bg-header-darker rounded-md h-9 relative z-0">
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
      className={`${position} w-2/4 relative z-2 h-7 rounded-md bg-header transition-all duration-250`}
    />
  );
}

function TagSelection({ preSelectedTags }) {
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

  return (
    <div className="w-full flex flex-col gap-2 justify-start overflow-hidden lg:hover:cursor-pointer">
      <div className="w-full flex flex-row justify-between items-center h-full">
        <div className="flex items-center">
          <p className="font-semibold">Tags</p>
        </div>
      </div>
      <div className="w-full flex flex-row flex-nowrap overflow-scroll gap-1 flex-start mb-2 overscroll-contain scrollbar-hide">
        <CreateTags />
        {tags.map((tag) => {
          const isPreSelected =
            preSelectedTags && preSelectedTags.includes(tag._id);
          return <Tag key={tag._id} tag={tag} isChecked={isPreSelected} />;
        })}
      </div>
    </div>
  );
}

function Tag({ tag, isChecked }) {
  const [checked, setChecked] = useState(isChecked || false);
  const toggleChecked = () => setChecked((prev) => !prev);

  return (
    <div
      className={`transition-all duration-75 no-tap-button text-md font-semibold border-2 border-color-dark-blue px-2 rounded-md min-w-max ${
        checked ? "bg-color-dark-blue text-white" : ""
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
        <AiOutlinePlusCircle className="h-full w-auto text-color-dark-blue" />
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
    <div className="no-tap-button text-md font-semibold border-2 border-color-dark-blue px-2 rounded-md overflow-hidden py-0 bg-color-dark-blue text-white">
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

// amount: transaction.amount.toLocaleString("en-US", {
//   style: "decimal",
//   minimumIntegerDigits: 1,
//   minimumFractionDigits: 2,
// }),
