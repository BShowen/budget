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
import { CategorySelectionInput } from "./formComponents/CategorySelectionInput";
import { SubmitButton } from "./formComponents/SubmitButton";
import { CancelButton } from "./formComponents/CancelButton";

// Hooks
import { useFormAmounts } from "./formHooks/useFormAmounts";
import { useFormDateInput } from "./formHooks/useFormDateInput";
import { useFormMerchantInput } from "./formHooks/useFormMerchantInput";
import { useFormNotesInput } from "./formHooks/useFormNotesInput";
import { useFormTags } from "./formHooks/useFormTags";
import { useKeyboard } from "../../hooks/useKeyboard";

// Collections
import { LedgerCollection } from "../../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../../api/Transaction/TransactionCollection";

// Utils
import { dates } from "../../util/dates";

// App context
import { RootContext } from "../../layouts/AppContent";

export const editTransactionLoader = ({ params: { transactionId } }) =>
  TransactionCollection.findOne({ _id: transactionId }) || redirect("/");

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
    return ledgerId ? LedgerCollection.findOne({ _id: ledgerId }) : undefined;
  });

  const dateInputProps = useFormDateInput({
    initialValue: dates.format(transaction?.createdAt || new Date(), {
      forHtml: true,
    }),
  });

  const [transactionType, setTransactionType] = useState(
    ledger
      ? ledger.kind === "income" ||
        ledger.kind === "savings" ||
        ledger.kind == "allocation"
        ? "income"
        : "expense"
      : transaction?.type || "expense"
  );

  const { amountInputProps, ledgerSelectionInputProps } = useFormAmounts({
    initialLedgerSelection: transaction?.allocations || ledger,
    initialDollarAmount: transaction?.amount || 0,
    transactionType: transaction?.type || ledger?.kind || "expense",
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

  const tagInputProps = useFormTags({ initialTagSelection: transaction?.tags });

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
    const createOrUpdate = transaction?._id
      ? "transaction.updateTransaction"
      : "transaction.createTransaction";
    Meteor.call(
      createOrUpdate,
      {
        ...(transaction ? { transactionId: transaction._id } : {}),
        createdAt: dateInputProps.submitValue,
        budgetId,
        type: transactionType,
        amount: amountInputProps.value,
        merchant: merchantInputProps.value,
        note: notesInputProps.value,
        allocations: ledgerSelectionInputProps.selectedLedgerList,
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
      <div className="fixed top-0 padding-top-safe-area w-full bg-main-nav-bg-color p-2 flex flex-col justify-start z-50">
        <div className="w-full px-1 py-1 flex flex-row justify-center items-center">
          <h2 className="text-white text-xl font-semibold">
            {transaction ? "Edit transaction" : "Add transaction"}
          </h2>
        </div>

        <ButtonGroup
          active={transactionType}
          setActiveTab={handleTransactionTypeChange}
        />
      </div>
      <div className="h-full w-full p-2 pb-16 pt-[85px]">
        <form className="flex flex-col justify-start gap-2">
          <AmountInput {...amountInputProps} />
          <DateInput {...dateInputProps} />
          <MerchantInput {...{ ...merchantInputProps, transactionType }} />
          <CategorySelectionInput
            {...ledgerSelectionInputProps}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
          <TagSelection {...tagInputProps} />
          <NotesInput {...notesInputProps} />
          <div className="flex flex-row items-center gap-2">
            <CancelButton />

            <SubmitButton isFormValid={isFormValid} onClick={submit} />
          </div>
        </form>
      </div>
    </>
  );
}
