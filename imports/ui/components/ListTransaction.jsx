import React from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopeCollection";
import { TagCollection } from "../../api/Tag/TagCollection";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";
import { dates } from "../util/dates";

// Icons
import { HiPlus } from "react-icons/hi";
import { LuChevronRight } from "react-icons/lu";
import { LuAlertCircle } from "react-icons/lu";

// Hooks
import { useTransaction } from "../hooks/useTransaction";
export function ListTransaction({ transactionId, isBordered }) {
  const { merchant, type, amount, ledgerNameList, isCategorized } =
    useTransaction({
      transactionId,
    });
  return (
    <div
      className={`w-full flex flex-row justify-between items-stretch min-h-12 ps-2 pe-3 lg:hover:cursor-pointer bg-white py-2 ${
        isBordered && "border-b"
      }`}
    >
      <div className="flex flex-row flex-nowrap justify-start items-center gap-1">
        <div className=" w-full flex flex-col justify-center items-start">
          <div className="flex flex-row justify-center items-center gap-1">
            <p className="truncate w-full text-lg">{cap(merchant)}</p>
            {!isCategorized && (
              <LuAlertCircle className="text-color-danger text-xl" />
            )}
          </div>
          <div className="flex flex-row justify-start flex-nowrap gap-1">
            <LedgerNames ledgerNameList={ledgerNameList} />
          </div>
        </div>
      </div>
      <div
        className={`flex flex-row items-center shrink-0 ${
          type == "income" && "text-green-700 gap-[2px]"
        }`}
        onClick={() => {
          // Implement on click handler
        }}
      >
        <span>{type === "income" && <HiPlus className="text-xs" />}</span>
        <p>{toDollars(amount)}</p>
        <LuChevronRight className="text-xl text-color-primary" />
      </div>
    </div>
  );
}

function LedgerNames({ ledgerNameList }) {
  // Function to format the array into the desired string format
  const formatNames = (names) => {
    if (names.length < 2) return cap(names[0]);

    let result = names
      .slice(0, -1)
      .map((name) => cap(name))
      .join(", ");
    result += ` & ${cap(names[names.length - 1])}`;
    return result;
  };

  return (
    <p className="text-xs font-medium text-color-light-gray">
      {formatNames(ledgerNameList)}
    </p>
  );
}

function ExpandedContent({ transaction, expanded }) {
  const envelopeList = useTracker(() => {
    const envelopeIdList = transaction.allocations.map(
      ({ envelopeId }) => envelopeId
    );
    return EnvelopeCollection.find({ _id: { $in: envelopeIdList } }).fetch();
  });

  const ledgerList = useTracker(() => {
    const ledgerIdList = transaction.allocations.map(
      ({ ledgerId }) => ledgerId
    );
    return LedgerCollection.find({ _id: { $in: ledgerIdList } }).fetch();
  });

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

  const envelopes = envelopeList.reduce(
    (acc, { name, _id }) => {
      const { _id: ledgerId, name: ledgerName } = ledgerList.find(
        ({ envelopeId }) => envelopeId == _id
      );
      return [
        ...acc,
        <div key={_id} className="tag bg-gray-400 border-gray-400">
          <p className="inline">{cap(name)} - </p>
          <Link
            key={ledgerId}
            to={`/ledger/${ledgerId}/transactions`}
            onClick={(e) => e.stopPropagation()}
          >
            {cap(ledgerName)}
          </Link>
        </div>,
      ];
    },
    [
      ...(transaction.isCategorized
        ? []
        : [
            <div
              key={"uncategorized"}
              className="tag bg-gray-400 border-gray-400"
            >
              <p>Uncategorized</p>
            </div>,
          ]),
    ]
  );

  return expanded ? (
    <div className="w-full overflow-x-hidden overflow-hidden flex flex-col justify-start items-stretch mt-10 overscroll-auto pt-2 scrollbar-hide h-full">
      <div className="flex flex-col justify-start items-stretch gap-1 ps-7">
        <div className="flex flex-row justify-center items-center mb-1 border border-color-dark-blue rounded-md bg-color-dark-blue w-max px-1">
          <p className="font-bold text-white text-md">
            Logged by {cap(transaction.loggedBy.firstName)} on{" "}
            {dates.format(transaction.createdAt, {
              forAllocation: true,
            })}
          </p>
        </div>

        <div className="flex flex-row justify-start items-center gap-1 flex-wrap">
          {envelopes}
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
        <EditTransactionButton transaction={transaction} />
        <DeleteTransactionButton transaction={transaction} />
      </div>
    </div>
  ) : (
    ""
  );
}

function EditTransactionButton({ transaction }) {
  return (
    <Link
      to={`/transaction/${transaction._id}/edit`}
      className="tag bg-gray-400 border-gray-400 font-medium"
      onClick={(e) => {
        // Prevent this click from closing the expanded content.
        e.stopPropagation();
      }}
    >
      Edit
    </Link>
  );
}

function DeleteTransactionButton({ transaction }) {
  const deleteTransaction = () => {
    try {
      Meteor.call(
        "transaction.deleteTransaction",
        {
          transactionId: transaction._id,
        },
        (error) => {
          if (error) {
            // The transaction.deleteTransaction method encountered an error.
            // Display a message for the user to try again.
            console.log({ error });
          } else {
            // The deletion was successful. Display a message to the user that
            // the document was deleted.
          }
        }
      );
    } catch (error) {
      console.log("Got an error", error.message);
      // There was an error calling the Meteor method.
      // I should display some notification to the user that they should try
      // again.
    }
  };
  return (
    <button
      className="tag bg-rose-500 border-rose-500 font-medium"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (transaction.isSplitTransaction) {
          const transactionCount = transaction.allocations.length;
          const confirm = window.confirm(
            `This is a split transaction and will delete ${transactionCount} transactions.`
          );
          if (confirm) {
            deleteTransaction();
          }
        } else {
          deleteTransaction();
        }
      }}
    >
      Delete
    </button>
  );
}
