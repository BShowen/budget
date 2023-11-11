import React, { useState, useEffect } from "react";
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
import { Transaction } from "./Transaction";

// Utils
import { cap } from "../util/cap";
import { reduceTransactions } from "../util/reduceTransactions";
import { toDollars } from "../util/toDollars";
import { dates } from "../util/dates";

// Icons
import { IoIosArrowBack } from "react-icons/io";
import { BiDollar, BiCheck, BiX } from "react-icons/bi";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { BsFillPlusCircleFill } from "react-icons/bs";

export const TransactionsList = () => {
  const { ledgerId } = useParams();
  const ledger = useTracker(() => LedgerCollection.findOne({ _id: ledgerId }));
  const { transactionList, spent } = useTracker(() => {
    if (!Meteor.userId()) return {};
    const transactionList = TransactionCollection.find({
      ledgerId: ledger._id,
    }).fetch();
    // income and expense for this ledger
    const { income, expense } = reduceTransactions({
      transactions: transactionList,
    });
    const spent = expense - income;
    return { transactionList, spent };
  });

  const { tagIdList } = useTracker(() => {
    // Return only the tags that have been used in this ledger's transactionList

    // Iterate through transactionList and reduce down to just the tags, making
    // sure to remove duplicates.
    const tags = transactionList.reduce((acc, transaction) => {
      const tags = transaction.tags || [];
      // use new Set() to remove duplicate tagIds
      return [...new Set([...acc, ...tags])];
    }, []);
    return { tagIdList: tags };
  });
  const [activeTags, setActiveTags] = useState([]);

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

  return (
    <div className="bg-slate-100 w-full">
      {ledger.isIncomeLedger ? (
        <IncomeHeader ledger={ledger} transactionList={transactionList} />
      ) : (
        <Header spent={spent} ledger={ledger} />
      )}
      <div className="bg-slate-100 flex flex-col gap-3 p-2">
        <TagSelector
          tagIdList={tagIdList}
          toggleTag={toggleTag}
          activeFilterTags={activeTags}
        />
        <TransactionList
          transactionList={transactionList}
          ledger={ledger}
          activeTags={activeTags}
        />
        <DeleteLedger ledgerId={ledger._id} />
      </div>
      <AddTransactionsCircle ledgerId={ledger._id} />
    </div>
  );
};

function Header({ ledger, spent }) {
  const navigate = useNavigate();
  const [percentSpent, setPercentSpent] = useState(0);

  useEffect(() => {
    // After component mounts, update the percentSpent so it animates from zero
    // to percentSpent.

    // If ledger.startingBalance is zero then percentage spent should always be
    // 100%. This is to avoid dividing by zero error because if user has spent
    // money but not set a startingBalance then spent / startingBalance is a
    // divide by zero error.
    const percentSpent =
      ledger.startingBalance == 0
        ? 100
        : (spent / ledger.startingBalance) * 100;
    setPercentSpent(percentSpent);
  }, [ledger]);

  const remaining = ledger.startingBalance - spent;
  const logo =
    remaining == 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : remaining < 0 ? (
      <BiX className="text-5xl text-rose-400" />
    ) : (
      <BiDollar
        className={`text-3xl ${
          spent > ledger.startingBalance ? "text-rose-400" : "text-emerald-400"
        }`}
      />
    );
  return (
    <div className="bg-sky-500 text-white px-1 pt-3 pb-8 z-50 sticky top-0  shadow-sm">
      <div
        className="text-left text-xl font-bold pb-3 px-2 flex flex-row items-center justify-start"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className="text-2xl" /> Back
      </div>
      <div className="bg-sky-700/50 grid grid-cols-12 rounded-lg w-11/12 mx-auto p-1 px-2 h-14 relative">
        <div className="col-start-1 col-span-6 h-fit text-start">
          <h2 className="text-xl font-bold">{cap(ledger.name)}</h2>
          {/* prettier-ignore */}
          <p className="text-xs font-semibold">
        {`${toDollars(spent)} spent of ${toDollars(ledger.startingBalance)}`}
      </p>
        </div>
        <div className="col-start-8 col-span-3 text-end h-fit">
          <p className="text-xs font-semibold">Remaining</p>
          <p
            className={`text-lg font-semibold ${
              spent > ledger.startingBalance && "text-rose-400"
            }`}
          >
            {toDollars(remaining)}
          </p>
        </div>
        <div className="col-start-11 col-span-2 absolute -right-6 -top-2">
          <div className="w-[70px] h-[70px] rounded-full ">
            <CircularProgressbarWithChildren
              value={percentSpent}
              background
              backgroundPadding={6}
              styles={buildStyles({
                backgroundColor: "#0387C5",
                pathColor:
                  spent > ledger.startingBalance ? "#fb7185" : "#34d399",
                trailColor: "transparent",
              })}
            >
              {logo}
            </CircularProgressbarWithChildren>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomeHeader({ ledger, transactionList }) {
  const navigate = useNavigate();
  const [percentReceived, setPercentReceived] = useState(0);

  const incomeReceived = transactionList.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
  const expectedIncome = ledger.startingBalance;

  useEffect(() => {
    // After component mounts, update the percentReceived so it animates from zero
    // to percentReceived.

    // If expectedIncome is zero then percentReceived should always be 100%.
    // This is to avoid dividing by zero, because if user has received money but
    // not set an expected amount then received / expected is dividing by zero.
    const percentReceived =
      ledger.startingBalance == 0
        ? 100
        : (incomeReceived / expectedIncome) * 100;
    setPercentReceived(percentReceived);
  }, [ledger]);

  const remaining = expectedIncome - incomeReceived;
  const logo =
    remaining == 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : remaining < 0 ? (
      <BiX className="text-5xl text-rose-400" />
    ) : (
      <BiDollar
        className={`text-3xl ${
          incomeReceived > expectedIncome ? "text-rose-400" : "text-emerald-400"
        }`}
      />
    );
  return (
    <div className="bg-sky-500 text-white px-1 pt-3 pb-8 z-50 sticky top-0 shadow-sm">
      <div
        className="text-left text-xl font-bold pb-3 px-2 flex flex-row items-center justify-start"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className="text-2xl" /> Back
      </div>
      <div className="bg-sky-700/50 grid grid-cols-12 rounded-lg w-11/12 mx-auto p-1 px-2 h-14 relative">
        <div className="col-start-1 col-span-6 h-fit text-start">
          <h2 className="text-xl font-bold">{cap(ledger.name)}</h2>
          {/* prettier-ignore */}
          <p className="text-xs font-semibold">
        {`${toDollars(incomeReceived)} received of ${toDollars(expectedIncome)}`}
      </p>
        </div>
        <div className="col-start-8 col-span-3 text-end h-fit">
          <p className="text-xs font-semibold">Income left to receive</p>
          <p
            className={`text-lg font-semibold ${
              incomeReceived > expectedIncome && "text-rose-400"
            }`}
          >
            {toDollars(remaining)}
          </p>
        </div>
        <div className="col-start-11 col-span-2 absolute -right-6 -top-2">
          <div className="w-[70px] h-[70px] rounded-full ">
            <CircularProgressbarWithChildren
              value={percentReceived}
              background
              backgroundPadding={6}
              styles={buildStyles({
                backgroundColor: "#0387C5",
                pathColor:
                  incomeReceived > expectedIncome ? "#fb7185" : "#34d399",
                trailColor: "transparent",
              })}
            >
              {logo}
            </CircularProgressbarWithChildren>
          </div>
        </div>
      </div>
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

  const [expanded, setExpanded] = useState(
    tagIdList.length > 0 && tagIdList.length < 10
  );

  const tagList =
    tagIdList.length > 0
      ? tags.map((tag) => (
          <button
            key={tag._id}
            className={`transition-all duration-250 no-tap-button text-md font-semibold border-2 border-sky-500 px-2 rounded-full min-w-max text-gray-700 ${
              activeFilterTags.includes(tag._id) ? "bg-sky-500 text-white" : ""
            }`}
            onClick={() => toggleTag(tag._id)}
          >
            {cap(tag.name)}
          </button>
        ))
      : "No tags";

  return (
    <div className="bg-white shadow-md py-2 rounded-lg px-3 flex flex-row items-center">
      <div
        className={`w-full flex flex-col gap-2 justify-start overflow-hidden ${
          expanded ? "h-auto" : "h-8"
        }`}
      >
        <div className="w-full flex flex-row justify-between items-center">
          <h2 className="text-md text-gray-400 font-semibold">
            Tags - {tagIdList.length}
          </h2>
          <div
            className="w-7 h-7 lg:hover:cursor-pointer flex flex-row justify-center items-center text-xl"
            onClick={() => {
              if (expanded) {
                // Clear filters and close
                toggleTag();
              }
              // Apply filter
              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? (
              <TfiAngleUp className="text-inherit" />
            ) : (
              <TfiAngleDown className="text-inherit" />
            )}
          </div>
        </div>
        <div className="w-full flex flex-row flex-wrap gap-2 items-center justify-start text-grey-700">
          {tagList}
        </div>
      </div>
    </div>
  );
}

function TransactionList({ transactionList, ledger, activeTags }) {
  return (
    <div className="bg-white shadow-md py-0 pb-2 rounded-lg px-3">
      <div className="w-full flex flex-row justify-between items-center py-2 px-1 h-12">
        <div>
          <h2 className="font-bold text-gray-400 text-md">
            {ledger.isIncomeLedger
              ? "Income this month"
              : "Transactions this month"}
          </h2>
        </div>
        <div>
          <Link
            to={`/ledger/${ledger._id}/transactions/new`}
            className="text-sky-500 font-bold"
          >
            {ledger.isIncomeLedger ? "Add income" : "Add transaction"}
          </Link>
        </div>
      </div>
      {transactionList
        .filter((transaction) => {
          if (activeTags.length === 0) return true;
          return (
            transaction.tags &&
            transaction.tags.some((tag) => activeTags.includes(tag))
          );
        })
        .map((transaction, i) => {
          const border = i === 0 ? "" : "border-t";
          const [month, day] = dates
            .format(transaction.createdAt, {
              forTransaction: true,
            })
            .split(" ");
          return (
            <Transaction
              key={transaction._id}
              ledgerId={ledger._id}
              transactionId={transaction._id}
              transaction={transaction}
              options={{ border, month, day }}
            />
          );
        })}
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
