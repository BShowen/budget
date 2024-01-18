import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useNavigate, useParams } from "react-router-dom";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TagCollection } from "../../api/Tag/TagCollection";

// Components
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { LedgerTransaction } from "./LedgerTransaction";

// Utils
import { cap } from "../util/cap";
import { reduceTransactions } from "../util/reduceTransactions";
import { toDollars } from "../util/toDollars";
import { dates } from "../util/dates";

// Icons
import { IoIosArrowBack } from "react-icons/io";
import { BiDollar, BiCheck, BiX } from "react-icons/bi";
import { BsFillPlusCircleFill } from "react-icons/bs";

export const TransactionsList = () => {
  const { ledgerId } = useParams();

  return (
    <div className="w-full">
      <PageHeader ledgerId={ledgerId} />
      <div className="flex flex-col gap-3 p-2 pt-52 pb-16">
        <LedgerNotes ledgerId={ledgerId} />
        <ListTransactions ledgerId={ledgerId} />
        <DeleteLedger ledgerId={ledgerId} />
      </div>
      {/* <AddTransactionsCircle ledgerId={ledgerId} /> */}
    </div>
  );
};

function PageHeader({ ledgerId }) {
  const ledger = useTracker(() => LedgerCollection.findOne({ _id: ledgerId }));
  switch (ledger.kind) {
    case "income":
      return <IncomeHeader ledger={ledger} />;
    case "expense":
      return <CategoryHeader ledger={ledger} />;
    case "savings":
      return <SavingsHeader ledger={ledger} />;
    case "allocation":
      return <AllocationHeader ledger={ledger} />;
  }
}

function ProgressHeader({ children, percent, pathColor, logo }) {
  const navigate = useNavigate();
  return (
    <div className="page-header w-full lg:w-3/5 h-48 bg-header flex flex-col justify-start z-50">
      <div className="relative z-0 flex flex-row items-center text-white p-1 h-11">
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
  );
}

function CategoryHeader({ ledger }) {
  const [percentSpent, setPercentSpent] = useState(0);

  const spent = useTracker(() => {
    if (!Meteor.userId()) return {};
    const transactionList = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
    // income and expense for this ledger
    const { income, expense } = reduceTransactions({
      transactions: transactionList,
    });
    const spent = expense - income;
    return spent;
  });

  useEffect(() => {
    // After component mounts, update the percentSpent so it animates from zero
    // to percentSpent.

    // If ledger.allocatedAmount is zero then percentage spent should always be
    // 100%. This is to avoid dividing by zero error because if user has spent
    // money but not set a allocatedAmount then spent / allocatedAmount is a
    // divide by zero error.
    const percentSpent =
      ledger.allocatedAmount == 0
        ? 100
        : (spent / ledger.allocatedAmount) * 100;
    setPercentSpent(percentSpent);
  }, [ledger]);

  const remaining = ledger.allocatedAmount - spent;
  const logo =
    remaining == 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : remaining < 0 ? (
      <BiX className="text-5xl text-rose-400" />
    ) : (
      <BiDollar
        className={`text-3xl ${
          spent > ledger.allocatedAmount ? "text-rose-400" : "text-emerald-400"
        }`}
      />
    );
  const pathColor = spent > ledger.allocatedAmount ? "#fb7185" : "#34d399";
  return (
    <ProgressHeader percent={percentSpent} pathColor={pathColor} logo={logo}>
      <div className="max-w-full flex flex-col justify-start items-stretch px-2 bg-app py-2 h-full">
        <div className="w-full flex flex-row justify-start items-center flex-nowrap">
          <h2 className="text-3xl font-bold">{cap(ledger.name)}</h2>
        </div>
        <div className="w-full flex flex-row flex-start justify-between items-center">
          <p className="font-semibold text-gray-500">
            Spent {toDollars(spent)} out of {toDollars(ledger.allocatedAmount)}
          </p>
        </div>
        <div className="w-full flex flex-col flex-nowrap justify-start items-end">
          {spent <= ledger.allocatedAmount ? (
            <>
              <p className="font-bold">Left to spend</p>
              <p className="text-4xl p-0">{toDollars(remaining)}</p>
            </>
          ) : (
            <>
              <p className="font-bold">Overspent by</p>
              <p className="text-4xl text-rose-500/90 p-0">
                {toDollars(remaining)}
              </p>
            </>
          )}
        </div>
      </div>
    </ProgressHeader>
  );
}

function IncomeHeader({ ledger }) {
  const transactionList = useTracker(() => {
    if (!Meteor.userId()) return {};
    return TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
  });
  const [percentReceived, setPercentReceived] = useState(0);

  const incomeReceived = transactionList.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
  const expectedIncome = ledger.allocatedAmount;

  useEffect(() => {
    // After component mounts, update the percentReceived so it animates from zero
    // to percentReceived.

    // If expectedIncome is zero then percentReceived should always be 100%.
    // This is to avoid dividing by zero, because if user has received money but
    // not set an expected amount then received / expected is dividing by zero.
    const percentReceived =
      ledger.allocatedAmount == 0
        ? 100
        : (incomeReceived / expectedIncome) * 100;
    setPercentReceived(percentReceived);
  }, [ledger]);

  const remainingToReceive = expectedIncome - incomeReceived;
  const logo =
    remainingToReceive == 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : remainingToReceive < 0 ? (
      <BiX className="text-5xl text-rose-400" />
    ) : (
      <BiDollar
        className={`text-3xl ${
          incomeReceived > expectedIncome ? "text-rose-400" : "text-emerald-400"
        }`}
      />
    );
  const pathColor = incomeReceived > expectedIncome ? "#fb7185" : "#34d399";
  return (
    <ProgressHeader percent={percentReceived} pathColor={pathColor} logo={logo}>
      <div className="max-w-full flex flex-col justify-start items-stretch px-2 bg-app py-2 h-full">
        <div className="w-full flex flex-row justify-start items-center flex-nowrap">
          <h2 className="text-3xl font-bold">{cap(ledger.name)}</h2>
        </div>
        <div className="w-full flex flex-row flex-start justify-between items-center">
          <p className="font-semibold text-gray-500">
            Received {toDollars(incomeReceived)} out of{" "}
            {toDollars(expectedIncome)}
          </p>
        </div>
        <div className="w-full flex flex-col flex-nowrap justify-start items-end">
          <p className="font-bold">Left to receive</p>
          <p className="text-4xl p-0">{toDollars(remainingToReceive)}</p>
        </div>
      </div>
    </ProgressHeader>
  );
}

function SavingsHeader({ ledger }) {
  const transactionList = useTracker(() => {
    if (!Meteor.userId()) return {};
    return TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
  });
  const [percentSaved, setPercentSaved] = useState(0);
  const { income, expense } = reduceTransactions({
    transactions: transactionList,
  });
  const totalSavedThisMonth = income;
  const plannedToSaveThisMonth = ledger.allocatedAmount;
  const balance = ledger.startingBalance - expense + income;

  useEffect(() => {
    // After component mounts, update the percentSaved so it animates from zero
    // to percentSaved.

    // If plannedToSaveThisMonth is zero then percentSaved should always be 100%.
    // This is to avoid dividing by zero, because if user has received money but
    // not set an expected amount then received / expected is dividing by zero.
    const percentSaved =
      ledger.allocatedAmount == 0
        ? 100
        : (totalSavedThisMonth / plannedToSaveThisMonth) * 100;
    setPercentSaved(percentSaved);
  }, [ledger]);

  const leftToSave =
    plannedToSaveThisMonth - totalSavedThisMonth < 0
      ? 0
      : plannedToSaveThisMonth - totalSavedThisMonth;
  const logo =
    leftToSave <= 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : (
      <BiDollar className="text-3xl text-emerald-400" />
    );
  return (
    <ProgressHeader percent={percentSaved} pathColor={"#34d399"} logo={logo}>
      <div className="max-w-full flex flex-col justify-start items-stretch px-2 bg-app py-2 h-full">
        <div className="w-full flex flex-row justify-start items-center flex-nowrap">
          <h2 className="text-3xl font-bold">{cap(ledger.name)}</h2>
        </div>
        <div className="w-full flex flex-row flex-start justify-between items-center">
          <p className="font-semibold text-gray-500">
            Saved {toDollars(totalSavedThisMonth)} out of{" "}
            {toDollars(plannedToSaveThisMonth)}
          </p>
        </div>
        <div className="w-full flex flex-col flex-nowrap justify-start items-end">
          <p className="font-bold">Available</p>
          <p className="text-4xl p-0">{toDollars(balance)}</p>
        </div>
      </div>
    </ProgressHeader>
  );
}

function AllocationHeader({ ledger }) {
  const transactionList = useTracker(() => {
    if (!Meteor.userId()) return {};
    return TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
  });
  const [percentSaved, setPercentSaved] = useState(0);
  const { income, expense } = reduceTransactions({
    transactions: transactionList,
  });
  const totalSavedThisMonth = income;
  const totalSavedSinceStart = ledger.allocation.runningTotal + income;
  const plannedToSaveThisMonth = ledger.allocatedAmount;
  const availableToSpend = ledger.startingBalance - expense + income;

  useEffect(() => {
    // After component mounts, update the percentSaved so it animates from zero
    // to percentSaved.

    // If plannedToSaveThisMonth is zero then percentSaved should always be 100%.
    // This is to avoid dividing by zero, because if user has received money but
    // not set an expected amount then received / expected is dividing by zero.
    const percentSaved =
      ledger.allocatedAmount == 0
        ? 100
        : (totalSavedThisMonth / plannedToSaveThisMonth) * 100;
    setPercentSaved(percentSaved);
  }, [ledger]);

  const leftToSave =
    plannedToSaveThisMonth - totalSavedThisMonth < 0
      ? 0
      : plannedToSaveThisMonth - totalSavedThisMonth;
  const logo =
    leftToSave <= 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : (
      <BiDollar className="text-3xl text-emerald-400" />
    );

  return (
    <ProgressHeader percent={percentSaved} pathColor={"#34d399"} logo={logo}>
      <div className="max-w-full flex flex-col justify-start items-stretch px-2 bg-app py-2 h-full">
        <div className="w-full flex flex-row justify-start items-center flex-nowrap">
          <h2 className="text-3xl font-bold">{cap(ledger.name)}</h2>
        </div>
        <div className="w-full flex flex-col flex-start justify-start items-start text-xs">
          <p className="font-extrabold text-gray-500">
            Saved {toDollars(totalSavedSinceStart)} out of{" "}
            {toDollars(ledger.allocation.goalAmount)} this year
          </p>
          <p className="font-extrabold text-gray-500">
            Saved {toDollars(totalSavedThisMonth)} out of{" "}
            {toDollars(plannedToSaveThisMonth)} this month
          </p>
          <p className="font-extrabold text-gray-500">
            This allocation will end on{" "}
            {dates.format(ledger.allocation.endDate, { forAllocation: true })}
          </p>
        </div>
        <div className="w-full flex flex-col flex-nowrap justify-start items-end">
          <p className="font-bold">Available to spend</p>
          <p className="text-4xl p-0">{toDollars(availableToSpend)}</p>
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
      className={`transition-all duration-250 no-tap-button text-md font-semibold border-2 border-blue-600 px-2 rounded-full min-w-max ${
        activeFilterTags.includes(tag._id) ? "bg-blue-600 text-white" : ""
      }`}
      onClick={() => toggleTag(tag._id)}
    >
      {cap(tag.name)}
    </button>
  ));

  return tagList.length > 0 ? (
    <div className="bg-white shadow-sm rounded-xl p-1 flex flex-col gap-[2px] justify-start items-stretch relative">
      <div className="absolute top-0 bottom-0 left-0 rounded-s-xl flex flex-row justify-center items-center w-12 px-1 bg-color-light-blue">
        <p className="font-bold text-white text-md">Tags</p>
      </div>
      <div className="w-full flex flex-row flex-wrap gap-2 items-center justify-start overflow-scroll scrollbar-hide ps-12 min-h-9 max-h-36">
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
    <div className="bg-white shadow-sm py-1 px-3 rounded-xl flex flex-col justify-center items-stretch">
      <textarea
        ref={textareaRef}
        className="font-medium w-full form-textarea focus:ring-0 border-0 placeholder:text-color-light-gray text-color-primary resize-none h-full p-0"
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
    } catch (error) {
      console.log("Error updating", error);
    }
  }
}

function ListTransactions({ ledgerId }) {
  const ledger = useTracker(() => LedgerCollection.findOne({ _id: ledgerId }));
  const [activeTags, setActiveTags] = useState([]);

  const { transactionList, filteredTransactions } = useTracker(() => {
    if (!Meteor.userId()) return {};
    const transactionList = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
    const filteredTransactions = transactionList.filter((transaction) => {
      if (activeTags.length === 0) return true;
      return (
        transaction.tags &&
        transaction.tags.some((tag) => activeTags.includes(tag))
      );
    });
    return { transactionList, filteredTransactions };
  });

  const {
    income: filteredTransactionsIncome,
    expense: filteredTransactionsExpense,
  } = reduceTransactions({
    transactions: filteredTransactions,
  });

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
    ledger.kind === "income"
      ? "Income this month"
      : `${filteredTransactions.length} ${
          filteredTransactions.length == 1 ? "transaction" : "transactions"
        }`;

  return (
    <>
      <TagSelector
        tagIdList={tagIdList}
        toggleTag={toggleTag}
        activeFilterTags={activeTags}
      />
      <div className="bg-white shadow-sm py-0 pb-2 rounded-lg px-3">
        <div className="w-full flex flex-row justify-between items-center py-2 px-1 h-12">
          <div>
            <h2 className="font-bold text-color-light-gray text-md">
              {transactionInfo}
            </h2>
          </div>
          <div>
            {activeTags.length > 0 ? (
              <p className="font-bold text-color-light-gray text-md">
                Spent{" "}
                {toDollars(
                  filteredTransactionsExpense - filteredTransactionsIncome
                )}
              </p>
            ) : (
              <Link
                to={`/ledger/${ledger._id}/transactions/new`}
                className="text-color-light-blue font-bold"
              >
                {ledger.kind === "income" ? "Add income" : "Add transaction"}
              </Link>
            )}
          </div>
        </div>
        {filteredTransactions.map((transaction, i) => {
          const border = i === 0 ? "" : "border-t";
          const [month, day] = dates
            .format(transaction.createdAt, {
              forTransaction: true,
            })
            .split(" ");
          return (
            <LedgerTransaction
              key={transaction._id}
              ledgerId={ledger._id}
              transactionId={transaction._id}
              transaction={transaction}
              options={{ border, month, day }}
            />
          );
        })}
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
    <div className="w-full flex flex-row justify-center items-center h-20">
      <button
        className="text-xl font-bold text-rose-500 lg:hover:cursor-pointer lg:hover:text-rose-600 lg:hover:underline transition-text duration-150"
        onClick={deleteLedger}
      >
        Delete ledger
      </button>
    </div>
  );
}

function AddTransactionsCircle({ ledgerId }) {
  return (
    <div className="fixed bottom-4 right-4 w-14 h-14 bg-white rounded-full flex flex-row justify-center items-center z-20">
      <Link
        className="w-full h-full"
        to={`/ledger/${ledgerId}/transactions/new`}
      >
        <BsFillPlusCircleFill className="text-sky-700 w-full h-full" />
      </Link>
    </div>
  );
}
