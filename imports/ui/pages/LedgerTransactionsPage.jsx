import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useNavigate, useParams } from "react-router-dom";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TagCollection } from "../../api/Tag/TagCollection";

// Components
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// import { LedgerTransaction } from "../components/ledgers/ledgerComponents/LedgerTransaction";
import { ListTransaction } from "../components/ListTransaction";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { dates } from "../util/dates";

// Icons
import { IoIosArrowBack } from "react-icons/io";
import { BiDollar, BiCheck, BiX } from "react-icons/bi";

// Hooks
import { useExpenseLedger } from "../hooks/useExpenseLedger";
import { useIncomeLedger } from "../hooks/useIncomeLedger";
import { useSavingsLedger } from "../hooks/useSavingsLedger";
import { groupTransactionsByDate } from "../util/groupTransactionsByDate";
import { TransactionGroup } from "../components/TransactionGroup";

export const LedgerTransactionsPage = () => {
  const { ledgerId } = useParams();

  return (
    <div className="w-full">
      <PageHeader ledgerId={ledgerId} />
      <div className="flex flex-col gap-3 pt-52 pb-16">
        <LedgerNotes ledgerId={ledgerId} />
        <ListTransactions ledgerId={ledgerId} />
        <DeleteLedger ledgerId={ledgerId} />
      </div>
    </div>
  );
};

function PageHeader({ ledgerId }) {
  const { kind } = useExpenseLedger({ ledgerId });
  switch (kind) {
    case "income":
      return <IncomeHeader ledgerId={ledgerId} />;
    case "expense":
      return <ExpenseHeader ledgerId={ledgerId} />;
    case "savings":
      return <SavingsHeader ledgerId={ledgerId} />;
  }
}

function ProgressHeader({ children, percent, pathColor, logo }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="empty-page-header bg-primary-blue dark:bg-blue-800"></div>
      <div className="page-header w-full lg:w-3/5 h-48 bg-slate-100 dark:bg-dark-mode-bg-0 flex flex-col justify-start z-50">
        <div className="relative z-0 flex flex-row items-center text-white p-1 h-11 bg-primary-blue dark:bg-blue-800">
          {/* Back button */}
          <div className="w-full flex flex-row justify-start items-center">
            <Link
              className="text-left text-xl font-bold flex flex-row items-center justify-start w-24 lg:hover:cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack className="text-2xl" /> Back
            </Link>
          </div>
          {/* Progress circle */}
          <div className="absolute z-10 right-2 top-2">
            <div className="w-[80px] h-[80px] rounded-full ">
              <CircularProgressbarWithChildren
                value={percent}
                background
                backgroundPadding={6}
                styles={buildStyles({
                  backgroundColor: "#f1f1f2",
                  pathColor,
                  trailColor: "#e2e8f0",
                })}
              >
                {logo}
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>
        <div className="grow">{children}</div>
      </div>
    </>
  );
}

function ExpenseHeader({ ledgerId }) {
  const [percentSpent, setPercentSpent] = useState(0);

  const { moneySpent, leftToSpend, allocatedAmount, name } = useExpenseLedger({
    ledgerId,
  });

  useEffect(() => {
    // After component mounts, update the percentSpent so it animates from zero
    // to percentSpent.

    // If allocatedAmount is zero then percentage spent should always be
    // 100%. This is to avoid dividing by zero error because if user has spent
    // money but not set a allocatedAmount then spent / allocatedAmount is a
    // divide by zero error.
    const percentSpent =
      allocatedAmount == 0 ? 100 : (moneySpent / allocatedAmount) * 100;
    setPercentSpent(percentSpent);
  }, [allocatedAmount, moneySpent]);

  const logo =
    leftToSpend == 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : leftToSpend < 0 ? (
      <BiX className="text-5xl text-rose-400" />
    ) : (
      <BiDollar
        className={`text-3xl ${
          moneySpent > allocatedAmount ? "text-rose-400" : "text-emerald-400"
        }`}
      />
    );
  const pathColor = moneySpent > allocatedAmount ? "#fb7185" : "#34d399";

  return (
    <ProgressHeader percent={percentSpent} pathColor={pathColor} logo={logo}>
      <div className="max-w-full flex flex-col justify-start items-stretch px-2 bg-app py-2 h-full">
        <div className="w-full flex flex-row justify-start items-center flex-nowrap">
          <h2 className="text-2xl font-bold">{cap(name)}</h2>
        </div>
        <div className="w-full flex flex-row flex-start justify-between items-center">
          <p className="font-semibold text-gray-500 dark:text-dark-mode-text-1 text-sm">
            Spent {toDollars(moneySpent)} out of {toDollars(allocatedAmount)}
          </p>
        </div>
        <div className="w-full flex flex-col flex-nowrap justify-start items-end">
          {moneySpent <= allocatedAmount ? (
            <>
              <p className="font-bold text-sm">Left to spend</p>
              <p className="text-2xl p-0 dark:text-dark-mode-text-1">
                {toDollars(leftToSpend)}
              </p>
            </>
          ) : (
            <>
              <p className="font-bold">Overspent by</p>
              <p className="text-2xl text-rose-500/90 p-0">
                {toDollars(Math.abs(leftToSpend))}
              </p>
            </>
          )}
        </div>
      </div>
    </ProgressHeader>
  );
}

function IncomeHeader({ ledgerId }) {
  const {
    incomeReceived,
    allocatedAmount,
    name,
    leftToReceive,
    percentIncomeReceived,
  } = useIncomeLedger({
    ledgerId,
  });

  const [percentReceived, setPercentReceived] = useState(0);

  useEffect(() => {
    // After component mounts, update the percentReceived so it animates from
    // zero to percentReceived.
    setPercentReceived(percentIncomeReceived);
  }, [ledgerId, percentIncomeReceived]);

  const logo =
    leftToReceive == 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : leftToReceive < 0 ? (
      <BiX className="text-5xl text-rose-400" />
    ) : (
      <BiDollar
        className={`text-3xl ${
          incomeReceived > allocatedAmount
            ? "text-rose-400"
            : "text-emerald-400"
        }`}
      />
    );

  const pathColor = incomeReceived > allocatedAmount ? "#fb7185" : "#34d399";

  return (
    <ProgressHeader percent={percentReceived} pathColor={pathColor} logo={logo}>
      <div className="max-w-full flex flex-col justify-start items-stretch px-2 bg-app py-2 h-full">
        <div className="w-full flex flex-row justify-start items-center flex-nowrap">
          <h2 className="text-2xl font-bold">{cap(name)}</h2>
        </div>
        <div className="w-full flex flex-row flex-start justify-between items-center">
          <p className="font-semibold text-gray-500 dark:text-dark-mode-text-1 text-sm">
            Received {toDollars(incomeReceived)} out of{" "}
            {toDollars(allocatedAmount)}
          </p>
        </div>
        <div className="w-full flex flex-col flex-nowrap justify-start items-end">
          <p className="font-bold text-sm">Left to receive</p>
          <p className="text-2xl p-0 dark:text-dark-mode-text-1">
            {toDollars(leftToReceive)}
          </p>
        </div>
      </div>
    </ProgressHeader>
  );
}

function SavingsHeader({ ledgerId }) {
  const {
    allocatedAmount,
    moneyReceived,
    leftToSave,
    savingsBalance,
    name,
    percentSaved,
  } = useSavingsLedger({ ledgerId });

  const [savedPercent, setPercentSaved] = useState(0);

  useEffect(() => {
    // After component mounts, update the percentSaved so it animates from zero
    // to percentSaved.
    setPercentSaved(percentSaved);
  }, [ledgerId]);

  const logo =
    leftToSave <= 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : (
      <BiDollar className="text-3xl text-emerald-400" />
    );
  return (
    <ProgressHeader percent={savedPercent} pathColor={"#34d399"} logo={logo}>
      <div className="max-w-full flex flex-col justify-start items-stretch px-2 bg-app py-2 h-full">
        <div className="w-full flex flex-row justify-start items-center flex-nowrap">
          <h2 className="text-2xl font-bold">{cap(name)}</h2>
        </div>
        <div className="w-full flex flex-row flex-start justify-between items-center">
          <p className="font-semibold text-gray-500 dark:text-dark-mode-text-1 text-sm">
            Saved {toDollars(moneyReceived)} out of {toDollars(allocatedAmount)}
          </p>
        </div>
        <div className="w-full flex flex-col flex-nowrap justify-start items-end">
          <p className="font-bold text-sm">Available</p>
          <p className="text-2xl p-0 dark:text-dark-mode-text-1">
            {toDollars(savingsBalance)}
          </p>
        </div>
      </div>
    </ProgressHeader>
  );
}

function TagSelector({ tagIdList, toggleTag, activeFilterTags }) {
  const { tags } = useTracker(() => {
    const tags = TagCollection.find(
      { _id: { $in: tagIdList } },
      { sort: { name: 1 } }
    ).fetch();
    return { tags };
  });

  const tagList = tags.map((tag) => (
    <button
      key={tag._id}
      className={`transition-all duration-250 no-tap-button text-sm font-medium border border-color-dark-blue px-2 rounded-md min-w-fit ${
        activeFilterTags.includes(tag._id)
          ? "bg-blue-700 text-white dark:text-dark-mode-text-0"
          : "text-dark-mode-text-1"
      }`}
      onClick={() => toggleTag(tag._id)}
    >
      {cap(tag.name)}
    </button>
  ));

  return tagList.length > 0 ? (
    <div className="bg-white dark:bg-dark-mode-bg-1 shadow-sm rounded-xl p-1 flex flex-col gap-[2px] justify-start items-stretch relative">
      <div className="absolute top-0 bottom-0 left-0 rounded-s-xl flex flex-row justify-center items-center w-12 px-1 bg-color-light-blue">
        <p className="text-white text-md">Tags</p>
      </div>
      <div className="w-full flex flex-row flex-wrap gap-2 items-center justify-start overflow-hidden ps-12 min-h-9 max-h-36">
        {tagList}
      </div>
    </div>
  ) : null;
}

function LedgerNotes({ ledgerId }) {
  const { ledger, notes } = useTracker(() => {
    const ledger = LedgerCollection.findOne({ _id: ledgerId });
    return { ledger, notes: ledger?.notes || "" };
  });
  const [updatedNotes, setUpdatedNotes] = useState(notes);
  const textareaRef = useRef(null);
  const [textareaRows, setTextareaRows] = useState(notes.split("\n").length);

  useLayoutEffect(() => {
    // Resize the textarea component to accommodate all the text that the user
    // is typing.
    // The textarea will grow/shrink as the user types.
    setTextareaRows(updatedNotes.split("\n").length);
  }, [updatedNotes]);

  return (
    <div className="bg-white dark:bg-dark-mode-bg-1 shadow-sm py-1 px-3 rounded-xl flex flex-col justify-center items-stretch">
      <textarea
        ref={textareaRef}
        className="font-medium w-full form-textarea focus:ring-0 border-0 placeholder:text-color-light-gray dark:text-dark-mode-text-1 resize-none h-full p-0 dark:bg-dark-mode-bg-1"
        rows={textareaRows <= 1 ? 2 : textareaRows}
        placeholder="Tap to add a note"
        value={updatedNotes}
        onChange={(e) => {
          setUpdatedNotes(e.target.value);
        }}
        onFocus={() => {
          document.addEventListener("keydown", handleKeyDown);
        }}
        onBlur={() => {
          document.removeEventListener("keydown", handleKeyDown);
          setUpdatedNotes(updatedNotes.trim());
          submit();
        }}
      />
    </div>
  );

  function handleKeyDown(e) {
    const isEscapeKey = e.key.toLowerCase() === "escape";
    if (isEscapeKey) {
      // This will remove focus from the textarea and also submit the data.
      textareaRef.current.blur();
    }
  }

  function submit() {
    try {
      Meteor.call("ledger.updateLedger", {
        _id: ledger._id,
        notes: updatedNotes,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.log("Error updating", error);
    }
  }
}

function ListTransactions({ ledgerId }) {
  const { transactionList, kind } = useExpenseLedger({
    ledgerId,
  });

  const [filteredTransactions, setFilteredTransactions] =
    useState(transactionList);

  const [activeTags, setActiveTags] = useState([]);

  useEffect(() => {
    setFilteredTransactions(
      transactionList.filter((transaction) => {
        if (activeTags.length === 0) return true;
        return (
          transaction.tags &&
          transaction.tags.some((tagId) => activeTags.includes(tagId))
        );
      })
    );
  }, [activeTags]);

  const tagIdList = useTracker(() => {
    // Return only the tags that have been used in this ledger's transactionList

    // Iterate through transactionList and reduce down to just the tags, making
    // sure to remove duplicates.
    return transactionList.reduce((acc, transaction) => {
      const tags = transaction.tags || [];
      // use new Set() to remove duplicate tagIds
      return [...new Set([...acc, ...tags])];
    }, []);
  });

  const toggleTag = (tagId) => {
    if (!tagId) {
      // Call toggleTag() with no params to clear the filters
      setActiveTags([]);
    } else {
      setActiveTags((prev) => {
        // If activeTags includes tagId, remove it, else, add it.
        if (prev.includes(tagId)) {
          return [...prev.filter((prevTagId) => prevTagId !== tagId)];
        } else {
          return [...prev, tagId];
        }
      });
    }
  };

  const transactionInfo =
    kind === "income"
      ? "Income this month"
      : `${filteredTransactions.length} ${
          filteredTransactions.length == 1 ? "transaction" : "transactions"
        }`;

  const filteredTransactionsTotal = filteredTransactions.reduce(
    (total, transaction) =>
      Math.round((total + transaction.amount) * 100) / 100,
    0
  );

  return (
    <>
      {/* <TagSelector
        tagIdList={tagIdList}
        toggleTag={toggleTag}
        activeFilterTags={activeTags}
      /> */}
      <div className="bg-white dark:bg-dark-mode-bg-1 shadow-sm py-0 pb-2 rounded-b-xl rounded-t-3xl">
        <div className="w-full flex flex-row justify-between items-center py-2 px-1 h-12">
          <div>
            <h2 className="font-bold text-color-light-gray text-md">
              {transactionInfo}
            </h2>
          </div>
          <div>
            {activeTags.length > 0 ? (
              <p className="font-bold text-color-light-gray text-md">
                Total {toDollars(filteredTransactionsTotal)}
              </p>
            ) : (
              <Link
                to={`/ledger/${ledgerId}/transactions/new`}
                className="text-color-light-blue font-bold"
              >
                {kind === "income" ? "Add income" : "Add transaction"}
              </Link>
            )}
          </div>
        </div>
        {filteredTransactions.length > 0 ? (
          groupTransactionsByDate({ transactions: filteredTransactions }).map(
            ({ date, transactions }) => (
              <TransactionGroup
                key={date}
                date={date}
                transactions={transactions}
              />
            )
          )
        ) : (
          <div className="flex flex-row justify-center items-center">
            <h2 className="dark:text-dark-mode-text-1">No transactions</h2>
          </div>
        )}
      </div>
    </>
  );
}

function DeleteLedger({ ledgerId }) {
  const navigate = useNavigate();
  const deleteLedger = () => {
    const confirmation = confirm(
      "Are you sure you want to delete this ledger?"
    );
    if (confirmation) {
      Meteor.call("ledger.deleteLedger", { ledgerId });
      navigate("/");
    }
  };
  return (
    <div className="w-full flex flex-row justify-center items-center mb-16">
      <button
        className="text-xl text-red-600 lg:hover:cursor-pointer transition-all px-3 border border-red-600 rounded-md active:text-white active:bg-red-600"
        onClick={deleteLedger}
      >
        Delete ledger
      </button>
    </div>
  );
}
