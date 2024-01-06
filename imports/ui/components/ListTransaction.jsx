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
export function ListTransaction({
  transaction,
  ledgerId,
  transactionId,
  options,
}) {
  const ledger = useTracker(() => {
    return ledgerId
      ? LedgerCollection.findOne({ _id: ledgerId })
      : { name: "uncategorized" };
  });
  const [isCategorized, setCategorized] = useState(ledgerId);
  const [expanded, setExpanded] = useState(false);
  const [expandedContent, setExpandedContent] = useState(false);

  const [merchant, setMerchant] = useState(
    transaction.merchant.length <= 12
      ? cap(transaction.merchant)
      : `${cap(transaction.merchant.slice(0, 10).trim())}...`
  );

  const toggleExpandedContent = () => {
    setExpanded((prev) => !prev);
    if (expanded) {
      // If content is currently expanded then wait 200ms before calling to
      // hide the content. This way the closing animation can finish before
      // the dom element is removed.
      setTimeout(() => {
        setExpandedContent((prev) => !prev);
      }, 200);
    } else {
      // If no expanded content is being shown, then immediately call for
      // the expanded content to be inserted into the dom so the animation
      // can start.
      setExpandedContent((prev) => !prev);
    }
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
  }, [expanded]);

  const defaultOptions = { border: "", month: "", day: "" };
  const { border, month, day } = { ...defaultOptions, ...options };
  return (
    // <Link
    //   to={`/ledger/${ledgerId}/transaction/${transactionId}/edit`}
    //   className="flex flex-row flex-nowrap justify-between items-center lg:hover:cursor-pointer h-8"
    // />
    <div
      onClick={toggleExpandedContent}
      className={`flex flex-col justify-start items-stretch lg:hover:cursor-pointer px-1 transition-all duration-200 ease-in-out relative ${
        expanded ? "h-64 bg-app shadow-inner" : "h-10"
      } `}
    >
      <div
        className={`w-full flex flex-row justify-between items-center h-10 absolute top-0 left-0 ps-1 pe-3 transition-colors ${
          expanded ? "bg-app" : "delay-[225ms] bg-white"
        }`}
      >
        <div
          className={`flex flex-row flex-wrap justify-start items-center gap-1 ${
            expanded ? "grow" : ""
          }`}
        >
          {isCategorized ? (
            <LuCheckCircle2 className="text-xl text-color-light-blue" />
          ) : (
            <LuCircle className="text-xl text-color-danger" />
          )}
          <p className="font-medium text-md">{merchant}</p>
        </div>
        <div className="text-md font-semibold flex flex-row items-center gap-1">
          <span>
            {transaction.type === "expense" ? (
              <HiMinus className="text-color-danger text-xl" />
            ) : (
              <HiPlus className="text-green-600 text-xl" />
            )}
          </span>
          <p>{toDollars(transaction.amount)}</p>
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
      return tags.map((tag) => <span key={tag._id}>{tag.name}</span>);
    } else {
      return "No tags";
    }
  });

  return (
    <div
      className={`w-full transition-all duration-200 ease-in flex flex-col items-stretch justify-center overflow-hidden ${
        expanded ? "h-full" : "h-0"
      }`}
    >
      <div className="list-transaction-details-container">
        <div className="list-transaction-details-left">
          <p>Transaction date:</p>
        </div>
        <div className="list-transaction-details-right">
          <p>
            {dates.format(transaction.createdAt, {
              forAllocation: true,
            })}
          </p>
        </div>
      </div>

      <div className="list-transaction-details-container">
        <div className="list-transaction-details-left">
          <p>Envelope:</p>
        </div>
        <div className="list-transaction-details-right">
          <p>{cap(envelope?.name || "Uncategorized")}</p>
        </div>
      </div>

      <div className="list-transaction-details-container">
        <div className="list-transaction-details-left">
          <p>Ledger:</p>
        </div>
        <div className="list-transaction-details-right">
          <p>{cap(ledger?.name || "Uncategorized")}</p>
        </div>
      </div>

      <div className="list-transaction-details-container">
        <div className="list-transaction-details-left">
          <p>Transaction amount:</p>
        </div>
        <div className="list-transaction-details-right">
          <p>{toDollars(transaction.amount)}</p>
        </div>
      </div>

      <div className="list-transaction-details-container">
        <div className="list-transaction-details-left">
          <p>Logged by:</p>
        </div>
        <div className="list-transaction-details-right">
          <p>{cap(transaction.loggedBy.firstName)}</p>
        </div>
      </div>

      <div className="list-transaction-details-container">
        <div className="list-transaction-details-left"></div>
        <div className="list-transaction-details-right"></div>
      </div>

      <div className="list-transaction-details-container">
        <div className="list-transaction-details-left">
          <p>Tags:</p>
        </div>
        <div className="list-transaction-details-right">
          <p>{tagList}</p>
        </div>
      </div>

      <div className="flex flex-col justify-start items-stretch">
        <div className="list-transaction-details-container">
          <div className="list-transaction-details-left">
            <p className="font-bold">Notes:</p>
          </div>
        </div>
        {transaction.note && (
          <div className="w-full bg-white rounded-lg px-2 shadow-sm">
            <p>{transaction.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
