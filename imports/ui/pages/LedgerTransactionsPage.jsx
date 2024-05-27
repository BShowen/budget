import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate, useParams } from "react-router-dom";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TagCollection } from "../../api/Tag/TagCollection";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { groupTransactionsByDate } from "../util/groupTransactionsByDate";

// Icons
import { LuListFilter } from "react-icons/lu";

// Hooks
import { useLedger } from "../hooks/useLedger";

// Components
import { TransactionGroup } from "../components/TransactionGroup";
import { NavHeader } from "../components/NavHeader";

export const LedgerTransactionsPage = () => {
  const { ledgerId } = useParams();

  useLayoutEffect(() => {
    document.body.classList.add("bg-app-bg-color");
    return () => document.body.classList.remove("bg-app-bg-color");
  }, []);

  const {
    name: ledgerName,
    displayBalance: currentBalance,
    progressPercentage,
    allocatedAmount,
    transactionList,
    kind,
  } = useLedger({
    ledgerId,
  });

  return (
    <>
      <NavHeader text={ledgerName} page="ledger-transactions-page" />
      <div className="bg-ledger-transactions-page-bg-color pb-5 pt-14">
        <div className="w-full p-2 flex flex-col gap-1 justify-center">
          <div className="flex flex-row justify-start items-center">
            <CurrentBalance currentBalance={currentBalance} />
          </div>
          <ProgressPercentage
            percent={progressPercentage}
            allocatedAmount={allocatedAmount}
          />
        </div>
        <div className="w-full p-2 pt-3">
          <Notes ledgerId={ledgerId} />
        </div>
      </div>

      <ListTransactions transactionList={transactionList} kind={kind} />
    </>
  );
};

function OptionsButton({ onClick }) {
  const clickHandler = onClick;
  return clickHandler ? (
    <button className="w-8 h-8" type="button" onClick={clickHandler}>
      <LuListFilter className="text-2xl stroke-1" />
    </button>
  ) : (
    ""
  );
}

function CurrentBalance({ currentBalance }) {
  const textColor = currentBalance < 0 ? "text-rose-500/80" : "";
  return (
    <div className="flex flex-col items-stretch">
      <h1 className={`text-xl font-semibold ${textColor}`}>
        {toDollars(currentBalance)}
      </h1>
      <p className="text-ledger-transactions-page-current-balance-color">
        Current balance
      </p>
    </div>
  );
}

function ProgressPercentage({ percent, allocatedAmount }) {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    setTimeout(() => {
      setWidth(percent);
    }, 300);
  }, [percent]);

  return (
    <div className="flex flex-col justify-center">
      <div className="bg-progress-percentage-bg-color h-2 rounded-lg overflow-hidden">
        <div
          className="transition-width duration-500 ease-in-out h-full rounded-lg bg-progress-percentage-color"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex flex-row justify-between text-xs font-semibold text-progress-percentage-text-color">
        <p>{toDollars(0)}</p>
        <p>{toDollars(allocatedAmount)}</p>
      </div>
    </div>
  );
}

function Notes({ ledgerId }) {
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
    <div className="bg-ledger-transactions-notes-bg-color rounded-xl flex flex-col justify-center items-stretch px-3 py-1">
      <p className="text-xs border-b border-ledger-transactions-notes-border-color text-ledger-transactions-notes-placeholder-color font-semibold">
        Notes
      </p>
      <textarea
        ref={textareaRef}
        className="w-full form-textarea focus:ring-0 border-0 placeholder:text-ledger-transactions-notes-placeholder-color text-ledger-transactions-notes-placeholder-color resize-none h-full p-0 bg-inherit"
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

function ListTransactions({ transactionList, kind }) {
  const transactionInfo =
    kind === "income"
      ? "Income this month"
      : `${transactionList.length} ${
          transactionList.length == 1 ? "transaction" : "transactions"
        }`;

  return (
    <div className="pb-32">
      <div className="w-full flex flex-row justify-between items-center p-2 h-12">
        <div>
          <h2 className="font-semibold text-color-light-gray text-md">
            {transactionInfo}
          </h2>
        </div>
        <div>
          {/* <Link
            to={`/ledger/${ledgerId}/transactions/new`}
            className="text-color-light-blue font-semibold"
          >
            {kind === "income" ? "Add income" : "Add transaction"}
          </Link> */}
          <OptionsButton onClick={() => {}} />
        </div>
      </div>
      {transactionList.length > 0 ? (
        groupTransactionsByDate({ transactions: transactionList }).map(
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
          <h2>No transactions</h2>
        </div>
      )}
    </div>
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
