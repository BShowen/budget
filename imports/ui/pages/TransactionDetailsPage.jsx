import React, { useLayoutEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useParams, Link, useNavigate } from "react-router-dom";

// Hooks
import { useTransaction } from "../hooks/useTransaction";

// Icons
import { HiPlus } from "react-icons/hi";

// Utils
import { toDollars } from "../util/toDollars";
import { cap } from "../util/cap";
import { dates } from "../util/dates";

// Components
import { NavHeader } from "../components/NavHeader";
import { ActionMenu } from "../components/ActionMenu";

export function TransactionDetailsPage() {
  const [isActionMenuOpen, setActionMenu] = useState(false);
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

  useLayoutEffect(() => {
    document.body.classList.add("bg-transaction-details-bg-color");
    return () =>
      document.body.classList.remove("bg-transaction-details-bg-color");
  }, []);

  return (
    <>
      <NavHeader
        text="Transaction Details"
        page="transaction-details-page"
        onClickMenuButton={() => {
          setActionMenu((prev) => !prev);
        }}
      />
      <div className="pt-14">
        <ActionMenu isOpen={isActionMenuOpen}>
          <div className="flex flex-row justify-center items-center gap-3 p-3">
            <DeleteTransactionButton transactionId={transactionId} />
            <EditTransactionButton transactionId={transactionId} />
          </div>
        </ActionMenu>
        <div className="border-b border-transaction-details-border-color w-full min-h-20 flex flex-col justify-center p-2">
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
        <div className="border-b border-transaction-details-border-color w-full min-h-14 flex flex-col justify-center p-2 pb-3">
          <p className="text-lg py-1">
            {allocations.length > 1 ? "Categories" : "Category"}
          </p>
          <div className="w-full ps-5">
            {categoryAndLedgerNameList.map((meta, i) => {
              const [categoryName, ledgerName] = meta;
              return (
                <p className="text-transaction-details-text-color" key={i}>
                  {`${cap(categoryName)} ${
                    ledgerName ? `- ${cap(ledgerName)}` : ""
                  }`}
                </p>
              );
            })}
          </div>
        </div>
        <div className="border-b border-transaction-details-border-color w-full min-h-14 flex flex-col justify-center p-2 pb-3">
          <p className="text-lg py-1">Tags</p>
          <div className="flex flex-row flex-wrap justify-start items-center gap-1 ps-5 text-transaction-details-text-color">
            {tagNameList.length > 0 ? (
              tagNameList.map((tagName, i) => {
                return (
                  <div
                    key={i}
                    className="text-sm font-medium border border-color-dark-blue px-2 rounded-md min-w-fit"
                  >
                    <p>{cap(tagName)}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm">No tags.</p>
            )}
          </div>
        </div>
        <div className="w-full min-h-14 flex flex-col justify-center p-2 pb-3">
          <p className="text-lg py-1">Notes</p>
          <div className="w-full ps-5 pe-5 text-transaction-details-text-color">
            {note ? <p>{note}</p> : <p className="text-sm">No notes.</p>}
          </div>
        </div>
      </div>
    </>
  );
}

function EditTransactionButton({ transactionId }) {
  return (
    <Link
      to={`/transaction/${transactionId}/edit`}
      className="text-xl text-green-700 lg:hover:cursor-pointer transition-all px-3 border border-green-700 rounded-md active:text-white active:bg-green-700"
    >
      Edit
    </Link>
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
      Delete
    </button>
  );
}
