import React from "react";
import { Meteor } from "meteor/meteor";
import { useParams, Link, useNavigate } from "react-router-dom";

// Hooks
import { useTransaction } from "../hooks/useTransaction";

// Icons
import { IoIosArrowBack } from "react-icons/io";
import { HiPlus } from "react-icons/hi";

// Utils
import { toDollars } from "../util/toDollars";
import { cap } from "../util/cap";
import { dates } from "../util/dates";
export function TransactionDetailsPage() {
  const { transactionId } = useParams();
  const {
    amount,
    loggedBy,
    merchant,
    createdAt,
    categoryAndLedgerNameList,
    tagNameList,
    note,
    type,
    allocations,
  } = useTransaction({
    transactionId,
  });

  const navigate = useNavigate();

  return (
    <>
      <div className="page-header w-full lg:w-3/5 flex flex-row justify-start items-center relative bg-primary-blue dark:bg-blue-800 shadow-sm text-white">
        <div className="flex flex-row items-center p-1 h-11 z-50">
          <Link
            className="text-xl font-bold flex flex-row justify-start items-center w-24 lg:hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack className="text-2xl" /> Back
          </Link>
        </div>
        <div className="fixed text-center w-full lg:w-3/5 z-40">
          <h1 className="font-bold text-lg">Transaction Details</h1>
        </div>
      </div>
      <div className="mt-11 bg-white dark:bg-dark-mode-bg-0">
        <div className="border-b dark:border-b-dark-mode-bg-2 bg-inherit w-full min-h-20 flex flex-col justify-center p-2">
          <h2 className="text-xl">{cap(merchant)}</h2>
          <h1
            className={`text-2xl flex flex-row items-center gap-1 ${
              type == "income" && "text-green-700"
            }`}
          >
            {type == "income" && <HiPlus className="text-lg" />}
            {toDollars(amount)}
          </h1>
          <p className="text-xl text-gray-500">
            {dates.format(createdAt, { forTransactionDetails: true })}
          </p>
          <p className="text-sm text-gray-500">
            {`Logged by `}
            {`${cap(loggedBy.firstName)} ${cap(loggedBy.lastName[0])}.`}
          </p>
        </div>
        <div className="border-b dark:border-b-dark-mode-bg-2 bg-inherit w-full min-h-14 flex flex-col justify-center p-2 pb-3">
          <p className="text-lg py-1">
            {allocations.length > 1 ? "Categories" : "Category"}
          </p>
          <div className="w-full ps-5">
            {categoryAndLedgerNameList.map((meta, i) => {
              const [categoryName, ledgerName] = meta;
              return (
                <p className="dark:text-dark-mode-text-1" key={i}>
                  {`${cap(categoryName)} ${
                    ledgerName ? `- ${cap(ledgerName)}` : ""
                  }`}
                </p>
              );
            })}
          </div>
        </div>
        <div className="border-b dark:border-b-dark-mode-bg-2 bg-inherit w-full min-h-14 flex flex-col justify-center p-2 pb-3">
          <p className="text-lg py-1">Tags</p>
          <div className="flex flex-row flex-wrap justify-start items-center gap-1 ps-5">
            {tagNameList.length > 0 ? (
              tagNameList.map((tagName, i) => {
                return (
                  <div
                    key={i}
                    className="text-sm font-medium border border-color-dark-blue px-2 rounded-md min-w-fit dark:text-dark-mode-text-1"
                  >
                    <p>{cap(tagName)}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-color-light-gray text-sm">No tags.</p>
            )}
          </div>
        </div>
        <div className="bg-inherit w-full min-h-14 flex flex-col justify-center p-2 pb-3">
          <p className="text-lg py-1">Notes</p>
          <div className="w-full ps-5 pe-5">
            {note ? (
              <p className="dark:text-dark-mode-text-1">{note}</p>
            ) : (
              <p className="text-sm text-color-light-gray">No notes.</p>
            )}
          </div>
        </div>

        <div className="min-h-28 flex flex-col justify-evenly items-center mb-20">
          <EditTransactionButton transactionId={transactionId} />
          <DeleteTransactionButton transactionId={transactionId} />
        </div>
      </div>
    </>
  );
}

function EditTransactionButton({ transactionId }) {
  return (
    <div className="w-full flex flex-row justify-center items-center">
      <Link
        to={`/transaction/${transactionId}/edit`}
        className="text-xl text-green-700 lg:hover:cursor-pointer transition-all px-3 border border-green-700 rounded-md active:text-white active:bg-green-700"
      >
        Edit Transaction
      </Link>
    </div>
  );
}

function DeleteTransactionButton({ transactionId }) {
  const navigate = useNavigate();
  const { isSplitTransaction, allocations } = useTransaction({ transactionId });
  const deleteTransaction = () => {
    try {
      navigate(-1);
      Meteor.call(
        "transaction.deleteTransaction",
        {
          transactionId: transactionId,
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
      console.log("Error deleting transaction: ", error.message);
      // There was an error calling the Meteor method.
      // I should display some notification to the user that they should try
      // again.
    }
  };
  return (
    <div className="w-full flex flex-row justify-center items-center">
      <button
        className="text-xl text-red-600 lg:hover:cursor-pointer transition-all px-3 border border-red-600 rounded-md active:text-white active:bg-red-600"
        onClick={() => {
          if (isSplitTransaction) {
            const transactionCount = allocations.length;
            const confirm = window.confirm(
              `This is a split transaction and will delete ${transactionCount} transactions.`
            );
            if (confirm) {
              deleteTransaction();
            }
          } else {
            const confirm = window.confirm(
              "Are you sure you want to delete this transaction?"
            );
            if (confirm) {
              deleteTransaction();
            }
          }
        }}
      >
        Delete Transaction
      </button>
    </div>
  );
}
