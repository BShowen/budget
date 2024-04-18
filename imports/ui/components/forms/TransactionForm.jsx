import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState, useContext, useEffect } from "react";
import {
  useNavigate,
  useParams,
  redirect,
  useLoaderData,
} from "react-router-dom";

// Components
import { ButtonGroup } from "./formComponents/ButtonGroup";
import { TagSelection } from "./formComponents/TagSelection";
import { DateInput } from "./formComponents/DateInput";
import { AmountInput } from "./formComponents/AmountInput";
import { MerchantInput } from "./formComponents/MerchantInput";
import { NotesInput } from "./formComponents/NotesInput";

// Hooks
import { useFormAmounts } from "./formHooks/useFormAmounts";
import { useFormDateInput } from "./formHooks/useFormDateInput";
import { useFormMerchantInput } from "./formHooks/useFormMerchantInput";
import { useFormNotesInput } from "./formHooks/useFormNotesInput";
import { useFormTags } from "./formHooks/useFormTags";
import { useKeyboard } from "./useKeyboard";

// Collections
import { LedgerCollection } from "../../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../../api/Transaction/TransactionCollection";

// Utils
import { dates } from "../../util/dates";

// App context
import { RootContext } from "../../layouts/AppData";
import { CategorySelectionInput } from "./formComponents/CategorySelectionInput";

export function loader({ params: { transactionId } }) {
  let transaction = TransactionCollection.findOne({ _id: transactionId });
  if (transaction) {
    if (transaction?.isSplitTransaction) {
      // Get a list of all the transactions in this split transaction
      const { splitTransactionId } = transaction;
      const transactions = TransactionCollection.find({
        splitTransactionId,
      }).fetch();
      // Get a list of all the ledgers associated with these transactions.
      const ledgers = LedgerCollection.find({
        _id: { $in: transactions.reduce((acc, t) => [...acc, t.ledgerId], []) },
      })
        .fetch()
        .map((ledger) => {
          // Add the amount allocated to each ledger
          const transaction = transactions.find(
            (t) => t.ledgerId == ledger._id
          );
          ledger.amount = transaction.amount;
          return ledger;
        });
      // Create a new transactions object with updated amount, and ledgerSelection
      const newTransaction = {
        ...transaction,
        amount: transactions.reduce(
          // The transaction total is the sum of all the transaction amounts.
          (total, t) => Math.round((t.amount + total) * 100) / 100,
          0
        ),
        ledgerSelection: ledgers,
      };
      return newTransaction;
    } else {
      return transaction;
    }
  } else {
    return redirect(`/`);
  }
}

export function TransactionForm() {
  const navigate = useNavigate();
  const rootContext = useContext(RootContext);
  const params = useParams();
  // transaction will be set only when editing a transaction.
  const transaction = useLoaderData();

  const { currentBudgetId: budgetId } = rootContext;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ledgerId will be truthy if the user is creating a new transaction for a
  // specific ledger.
  const ledger = useTracker(() => {
    const { ledgerId } = params;
    if (!ledgerId) return undefined;
    return LedgerCollection.findOne({ _id: ledgerId });
  });

  const dateInputProps = useFormDateInput({
    initialValue: dates.format(transaction?.createdAt || new Date(), {
      forHtml: true,
    }),
  });

  const [transactionType, setTransactionType] = useState(
    ledger?.kind === "income" ||
      ledger?.kind === "savings" ||
      ledger?.kind == "allocation"
      ? "income"
      : "expense"
  );

  const { amountInputProps, ledgerSelectionInputProps } = useFormAmounts({
    initialLedgerSelection: transaction?.ledgerSelection || ledger,
    initialDollarAmount: transaction?.amount || 0,
  });

  function handleTransactionTypeChange(newTransactionType) {
    if (newTransactionType === transactionType) return;
    setTransactionType(newTransactionType);
    ledgerSelectionInputProps.setTransactionType(newTransactionType);
  }

  const merchantInputProps = useFormMerchantInput({
    initialValue: transaction?.merchant || "",
  });

  const notesInputProps = useFormNotesInput({
    initialValue: transaction?.note || "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const tagInputProps = useFormTags();

  useKeyboard({
    enter: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDialogOpen) {
        setIsDialogOpen(false);
      } else {
        submit();
      }
    },
    escape: () => {
      if (isDialogOpen) {
        setIsDialogOpen(false);
      } else {
        navigate(-1);
      }
    },
  });

  useEffect(() => {
    // Update isFormValid on each re-render
    const isValid =
      amountInputProps.isValid() &&
      dateInputProps.isValid() &&
      merchantInputProps.isValid();
    if (isFormValid === isValid) return;
    setIsFormValid(isValid);
  });

  function submit() {
    if (!isFormValid) return;
    Meteor.call(
      "transaction.createTransaction",
      {
        ...(transaction ? { transactionId: transaction._id } : {}),
        createdAt: dateInputProps.value,
        budgetId,
        type: transactionType,
        amount: amountInputProps.value,
        merchant: merchantInputProps.value,
        note: notesInputProps.value,
        selectedLedgerList: ledgerSelectionInputProps.selectedLedgerList.map(
          (ledger) => ({ _id: ledger._id, amount: ledger.amount })
        ),
        tags: tagInputProps.tagList
          .filter((tag) => tag.isSelected && !tag.isNew)
          .map((tag) => tag._id),
        newTags: tagInputProps.tagList
          .filter((tag) => tag.isSelected && tag.isNew)
          .map((tag) => tag.name),
      },
      (error) => {
        if (error) console.log(error);
      }
    );
    navigate(-1, { replace: true });
  }

  return (
    <>
      <div className="page-header w-full lg:w-3/5 bg-header p-2 flex flex-col justify-start z-50">
        <div className="w-full px-1 py-2 grid grid-cols-12 font-bold text-center items-center">
          <h2
            className="col-start-1 col-end-3 text-white lg:hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </h2>
          <h2 className="col-start-3 col-end-11 text-white text-xl">
            New transaction
          </h2>
          <button
            className={`col-start-11 col-end-13 ${
              isFormValid
                ? "text-white lg:hover:cursor-pointer"
                : "text-gray-700 lg:hover:cursor-not-allowed"
            }`}
            onClick={isFormValid ? submit : undefined}
            type="submit"
          >
            Done
          </button>
        </div>

        <ButtonGroup
          active={transactionType}
          setActiveTab={handleTransactionTypeChange}
        />
      </div>
      <div className="h-full w-full pt-24 p-2 mb-24">
        <form className="flex flex-col justify-start gap-2">
          <AmountInput {...amountInputProps} />
          <DateInput {...dateInputProps} />
          <MerchantInput {...{ ...merchantInputProps, transactionType }} />
          <NotesInput {...notesInputProps} />
          <TagSelection {...tagInputProps} />
          <CategorySelectionInput
            {...ledgerSelectionInputProps}
            transactionType={transactionType}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </form>
      </div>
    </>
  );
}
