import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";
import { TagCollection } from "../../api/Tag/TagCollection";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { dates } from "../util/dates";

// Icons
import { HiMinus, HiPlus } from "react-icons/hi";
import { LuCheckCircle2, LuCircle } from "react-icons/lu";
export function ListTransaction({ transaction, ledgerId }) {
  const isCategorized = !!ledgerId;
  const [expanded, setExpanded] = useState(false);

  const [merchant, setMerchant] = useState(
    transaction.merchant.length <= 12
      ? cap(transaction.merchant)
      : `${cap(transaction.merchant.slice(0, 10).trim())}...`
  );

  const toggleExpandedContent = () => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    // Change merchant name based on whether or not the transaction is expanded.
    if (expanded) {
      setMerchant(cap(transaction.merchant));
    } else {
      setMerchant(
        transaction.merchant.length <= 12
          ? cap(transaction.merchant)
          : `${cap(transaction.merchant.slice(0, 10).trim())}...`
      );
    }
  }, [expanded, transaction.merchant]);

  return (
    // <Link
    //   to={`/ledger/${ledgerId}/transaction/${transactionId}/edit`}
    //   className="flex flex-row flex-nowrap justify-between items-center lg:hover:cursor-pointer h-8"
    // />
    <div
      onClick={toggleExpandedContent}
      className={`flex flex-col justify-start items-stretch lg:hover:cursor-pointer px-1 transition-all duration-200 ease-in-out relative ${
        expanded
          ? transaction.note
            ? "h-56 bg-app shadow-inner"
            : "h-48 bg-app shadow-inner"
          : "h-10"
      } `}
    >
      <div
        className={`w-full flex flex-row justify-between items-center h-10 absolute top-0 left-0 ps-1 pe-3 transition-all ${
          expanded ? "bg-app" : "bg-white"
        }`}
      >
        <div
          className={`transition-all duration-200 flex flex-row flex-nowrap justify-start items-center gap-1 overflow-hidden ${
            expanded ? "w-full" : "w-3/5"
          }`}
        >
          <div className="w-5 h-5 shrink-0">
            {isCategorized ? (
              <LuCheckCircle2 className="w-full h-full text-color-light-blue" />
            ) : (
              <LuCircle className="w-full h-full text-color-danger" />
            )}
          </div>
          <p
            className={`${
              expanded ? "font-bold text-lg" : "font-medium text-md"
            } truncate w-full`}
          >
            {cap(transaction.merchant)}
          </p>
        </div>
        <div className="text-md font-semibold flex flex-row items-center gap-1">
          <span>
            {transaction.type === "expense" ? (
              <HiMinus className="text-color-danger text-xl" />
            ) : (
              <HiPlus className="text-green-600 text-xl" />
            )}
          </span>
          <p
            className={`${
              expanded ? "font-bold text-lg" : "font-medium text-md"
            }`}
          >
            {toDollars(transaction.amount)}
          </p>
        </div>
      </div>

      <ExpandedContent transaction={transaction} expanded={expanded} />
    </div>
  );
}

function ExpandedContent({ transaction, expanded }) {
  const envelope = useTracker(() =>
    EnvelopeCollection.findOne({ _id: transaction.envelopeId })
  );
  const ledger = useTracker(() =>
    LedgerCollection.findOne({ _id: transaction.ledgerId })
  );
  const tagList = useTracker(() => {
    const tags = TagCollection.find({
      _id: { $in: transaction.tags || [] },
    }).fetch();
    if (tags.length > 0) {
      return tags.map((tag) => (
        <div className="tag text-sm" key={tag._id}>
          {cap(tag.name)}
        </div>
      ));
    } else {
      return [];
    }
  });

  return (
    <div
      className={`w-full transition-all duration-200 ease-in overflow-x-hidden overflow-y-scroll flex flex-col justify-start items-stretch mt-10 overscroll-auto ${
        expanded ? "h-full" : "h-0"
      }`}
    >
      <div className="flex flex-col justify-start items-stretch gap-1 ps-7">
        <div className="flex flex-row justify-center items-center mb-1 border border-color-dark-blue rounded-md bg-color-dark-blue w-max px-1">
          <p className="font-bold text-white text-md">
            Created by {cap("bradley")} on{" "}
            {dates.format(transaction.createdAt, {
              forAllocation: true,
            })}
          </p>
        </div>

        <div className="flex flex-row justify-start items-center gap-1">
          <div className="tag bg-gray-400 border-gray-400">
            {cap(envelope?.name || "Uncategorized")}
          </div>
          <div className="tag bg-gray-400 border-gray-400">
            {cap(ledger?.name || "Uncategorized")}
          </div>
        </div>

        <div className="text-left flex flex-row gap-1 items-center">
          <p className="font-semibold text-gray-500 text-md">
            {tagList.length > 0 ? "Tags:" : "No tags"}
          </p>
          {tagList.length > 0 && (
            <div className="rounded-md flex flex-row justify-start items-center gap-1 overflow-x-scroll w-full scrollbar-hide">
              {tagList}
            </div>
          )}
        </div>

        <div className="text-left flex flex-row gap-1 items-center">
          <p className="font-semibold text-gray-500 text-md">
            {transaction.note ? "Notes:" : "No notes"}{" "}
            <span className="text-gray-400 font-normal text-sm">
              {transaction.note}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        <button
          className="tag bg-gray-400 border-gray-400 font-medium"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          Edit
        </button>
        <button
          className="tag bg-rose-500 border-rose-500 font-medium"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
