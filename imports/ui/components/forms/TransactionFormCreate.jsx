import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

// Collections
import { LedgerCollection } from "../../../api/Ledger/LedgerCollection";

// Utils
import { dates } from "../../util/dates";

// App context
import { RootContext } from "../../layouts/AppData";
import { CategorySelectionInput } from "./formComponents/CategorySelectionInput";

export function CreateTransactionForm() {
  const navigate = useNavigate();
  const rootContext = useContext(RootContext);
  const formRef = useRef(null);
  const params = useParams();

  const { currentBudgetId: budgetId } = rootContext;

  // ledgerId will be truthy if the user is creating a new transaction for a
  // specific ledger.
  const { ledgerId } = params;
  const ledger = useTracker(() => {
    if (!ledgerId) return undefined;
    return LedgerCollection.findOne({ _id: ledgerId });
  });

  const dateInputProps = useFormDateInput({
    initialValue: dates.format(new Date(), { forHtml: true }),
  });

  const [transactionType, setTransactionType] = useState(
    ledger?.kind === "income" ||
      ledger?.kind === "savings" ||
      ledger?.kind == "allocation"
      ? "income"
      : "expense"
  );

  const { amountInputProps, ledgerSelectionInputProps } = useFormAmounts({
    initialLedgerSelection: ledger,
    initialDollarAmount: 0,
  });

  function handleTransactionTypeChange(newTransactionType) {
    if (newTransactionType === transactionType) return;
    setTransactionType(newTransactionType);
    ledgerSelectionInputProps.setTransactionType(newTransactionType);
  }

  const merchantInputProps = useFormMerchantInput({ initialValue: "" });

  const notesInputProps = useFormNotesInput({ initialValue: "" });

  const [isFormValid, setIsFormValid] = useState(false);

  // const [formData, setFormData] = useState({
  //   createdAt: dates.format(new Date(), { forHtml: true }),
  //   budgetId,
  //   type:
  //     ledger?.kind === "income" ||
  //     ledger?.kind === "savings" ||
  //     ledger?.kind == "allocation"
  //       ? "income"
  //       : "expense",
  //   amount: "0.00",
  //   merchant: "",
  //   note: "",
  //   selectedLedgers: {
  //     // If ledgerId is truthy then this form has been rendered with a
  //     // preselected ledger.
  //     ...(ledgerId && {
  //       [ledgerId]: {
  //         willUnmount: false, //Set to true 301ms before this ledger is removed.
  //         splitAmount: formatDollarAmount(0),
  //         isLocked: false, //Set to true when the user has set the splitAmount.
  //       },
  //     }),
  //   },
  // });

  function submit() {
    console.log("submit");
    return;
    if (!isFormValid) return;
    // Handle tags.
    const form = new FormData(formRef.current);
    const tags = form.getAll("tags");
    const newTags = form.getAll("newTags");

    // Split selectedLedgers from formData.
    const { selectedLedgers, ...formDetails } = { ...formData };

    // Format the date
    if (formDetails.createdAt) {
      // Set the correct date
      const [year, month, day] = formData.createdAt.split("-");
      const formattedDate = new Date(year, month - 1, day);
      formDetails.createdAt = formattedDate;
    }

    // Format selectedLedgers
    // convert
    // {
    //   JPMBuvTg5PwJCTtjy: { willUnmount: false, splitAmount: '34.00', isLocked: true },
    //   QWXoBfB9wec6P7Mk3: { willUnmount: false, splitAmount: '66.00', isLocked: false }
    // }
    // into
    // [
    //   { ledgerId: "ledgerPrimaryKey", amount: "34.00" },
    //   { ledgerId: "ledgerPrimaryKey", amount: "66.00" }
    // ]
    const allocations = Object.entries(selectedLedgers).reduce((acc, item) => {
      const [ledgerId, meta] = item;
      return [...acc, { ledgerId: ledgerId, amount: meta.splitAmount }];
    }, []);

    Meteor.call(
      "transaction.createTransaction",
      {
        ...formDetails,
        allocations,
        tags,
        newTags,
      },
      (error) => {
        if (error) console.log(error.details);
      }
    );
    navigate(-1, { replace: true });
  }

  // Handle "escape" and "enter" keydown events.
  // useEffect(() => {
  //   function handleKeyDown(e) {
  //     const key = e.key.toLowerCase();
  //     if (key === "escape") {
  //       if (isDialogOpen) {
  //         closeDialog();
  //       } else {
  //         // Close the form when the escape key is pressed
  //         navigate(-1);
  //       }
  //     } else if (key === "enter") {
  //       if (isDialogOpen) {
  //         closeDialog();
  //       } else {
  //         // Submit the form when the enter key is pressed
  //         submit();
  //       }
  //     }
  //   }
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, [formData, isDialogOpen, isFormValid]);

  // Update isFormValid when formData changes.
  // useEffect(() => {
  //   const isSplitTransaction = Object.keys(formData.selectedLedgers).length > 1;
  //   const correctBalance = isSplitTransaction
  //     ? Object.values(formData.selectedLedgers).reduce(
  //         (total, meta) => total + parseFloat(meta.splitAmount),
  //         0
  //       ) == parseFloat(formData.amount)
  //     : true;
  //   const noZeroDollarBalance = isSplitTransaction
  //     ? Object.values(formData.selectedLedgers).every(
  //         (meta) => parseFloat(meta.splitAmount) > 0
  //       )
  //     : true;
  //   /* prettier-ignore */
  //   setIsFormValid(
  //     formData.amount != undefined &&
  //     parseFloat(formData.amount) > 0.0 &&
  //     formData.createdAt != undefined &&
  //     new Date(formData.createdAt) != "Invalid Date" &&
  //     formData.merchant != undefined &&
  //     formData.merchant.trim().length > 0 &&
  //     Object.keys(formData.selectedLedgers).length > 0 &&
  //     correctBalance &&
  //     noZeroDollarBalance
  //   );
  // }, [formData]);

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
            // onClick={isFormValid ? submit : undefined}
            onClick={submit}
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
        <form ref={formRef} className="flex flex-col justify-start gap-2">
          <AmountInput {...amountInputProps} />
          <DateInput {...dateInputProps} />
          <MerchantInput {...{ ...merchantInputProps, transactionType }} />
          <NotesInput {...notesInputProps} />

          <div className="w-full flex flex-col items-stretch justify-start bg-white rounded-xl overflow-hidden shadow-sm px-2 py-1">
            <TagSelection preSelectedTags={undefined} key={ledgerId} />
          </div>

          <CategorySelectionInput
            {...{ ...ledgerSelectionInputProps, transactionType }}
          />
        </form>
      </div>
    </>
  );
}
