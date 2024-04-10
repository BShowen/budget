import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pickBy } from "lodash";

// Components
import { SelectedLedger } from "./formComponents/SelectedLedger";
import { Dialog } from "./formComponents/Dialog";
import { ButtonGroup } from "./formComponents/ButtonGroup";
import { TagSelection } from "./formComponents/TagSelection";

// Collections
import { LedgerCollection } from "../../../api/Ledger/LedgerCollection";

// Utils
import { dates } from "../../util/dates";
import { formatDollarAmount } from "../../util/formatDollarAmount";
import { splitDollars } from "../../util/splitDollars";

// Icons
import { IoIosAdd } from "react-icons/io";

// App context
import { RootContext } from "../../layouts/AppData";
import { toDollars } from "../../util/toDollars";

export function CreateTransactionForm() {
  const navigate = useNavigate();
  const rootContext = useContext(RootContext);
  const formRef = useRef(null);
  const params = useParams();
  const [categorySelector, setCategorySelector] = useState("closed");
  const { currentBudgetId: budgetId } = rootContext;

  // ledgerId will be truthy if the user is creating a new transaction for a
  // specific ledger.
  const { ledgerId } = params;
  const ledger = useTracker(() => {
    if (!ledgerId) return undefined;
    return LedgerCollection.findOne({ _id: ledgerId });
  });

  const [formData, setFormData] = useState({
    createdAt: dates.format(new Date(), { forHtml: true }),
    budgetId,
    type:
      ledger?.kind === "income" ||
      ledger?.kind === "savings" ||
      ledger?.kind == "allocation"
        ? "income"
        : "expense",
    amount: "0.00",
    merchant: "",
    note: "",
    selectedLedgers: {
      // If ledgerId is truthy then this form has been rendered with a
      // preselected ledger.
      ...(ledgerId && {
        [ledgerId]: {
          willUnmount: false, //Set to true 301ms before this ledger is removed.
          splitAmount: formatDollarAmount(0),
          isLocked: false, //Set to true when the user has set the splitAmount.
        },
      }),
    },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const setActiveTab = (active) => {
    setFormData((prev) => ({
      ...prev,
      type: active,
      // Only update this field if active is "expense"
      // If active is "expense" then remove any ledgers of kind "income" because
      // income ledgers can't have expenses.
      ...(active === "expense" &&
        (() => {
          // Return an object from this method because the return value is used
          // in the spread operator.
          return {
            // Iterate through formData.selectedLedgers and set every income
            // ledger's willUnmount field to true.
            selectedLedgers: Object.fromEntries(
              Object.entries(prev.selectedLedgers).map((selectedLedger) => {
                // selectedLedger is an entry like [ledgerId, {willUnmount: false, splitAmount: 0.00}]
                const [selectedLedgerId, selectedLedgerMeta] = selectedLedger;

                // If ledger is true, then this selectedLedger is a ledger of
                // kind "income" and willUnmount needs to be set to true
                const ledger = LedgerCollection.findOne({
                  _id: selectedLedgerId,
                  kind: "income",
                });
                if (ledger) {
                  return [
                    [selectedLedgerId],
                    { ...selectedLedgerMeta, willUnmount: true },
                  ];
                } else {
                  return selectedLedger;
                }
              })
            ),
          };
        })()),
    }));
  };

  function handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "amount":
        setFormData((prev) => ({
          ...prev,
          [name]: formatDollarAmount(value),
        }));
        updateSplitAmount({ ledgerId: null, amount: null });
        break;
      default:
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
  }

  function updateSplitAmount({ ledgerId, amount }) {
    setFormData((prev) => {
      // Make a copy of previous selected ledgers to work with.
      const prevLedgers = { ...prev.selectedLedgers };

      // Calculate the remaining balance to split amongst the ledgers.
      const remainingBalance = (
        parseFloat(prev.amount) -
        parseFloat(
          Object.entries(prevLedgers).reduce((acc, selectedLedger) => {
            const [prevLedgerId, ledgerMeta] = selectedLedger;
            if (prevLedgerId == ledgerId) {
              return (
                parseFloat(acc) + parseFloat(formatDollarAmount(amount))
              ).toFixed(2);
            } else if (ledgerMeta.isLocked) {
              return (
                parseFloat(acc) +
                parseFloat(formatDollarAmount(ledgerMeta.splitAmount))
              ).toFixed(2);
            } else {
              return acc;
            }
          }, 0)
        ).toFixed(2)
      ).toFixed(2);

      // Split the remaining balance into equal parts.
      // This is an array where each index holds a string value floating point
      // number. ["13.40", "1.50", "2.00"] etc.
      const splitAmounts = splitDollars(
        remainingBalance,
        Object.entries(prevLedgers).reduce((acc, selectedLedger) => {
          const [prevLedgerId, ledgerMeta] = selectedLedger;
          if (ledgerMeta.isLocked == false && prevLedgerId != ledgerId) {
            return acc + 1;
          } else {
            return acc;
          }
        }, 0)
      );

      // Update each selected ledger's splitAmount
      Object.keys(prevLedgers).forEach((prevLedgerId) => {
        if (prevLedgerId == ledgerId) {
          // If preLedgerId == ledgerId then this is the ledger that the user is
          // currently typing into. Set the splitAmount to what the user is typing.
          prevLedgers[prevLedgerId] = {
            ...prevLedgers[prevLedgerId],
            splitAmount: formatDollarAmount(amount),
            isLocked: true,
          };
        } else if (prevLedgers[prevLedgerId].isLocked == false) {
          // Set the ledger's splitAmount to the first value in splitAmounts
          prevLedgers[prevLedgerId] = {
            ...prevLedgers[prevLedgerId],
            splitAmount: formatDollarAmount(splitAmounts.shift()),
          };
        }
      });

      return {
        ...prev,
        selectedLedgers: { ...prevLedgers },
      };
    });
  }

  function selectLedger({ ledgerId }) {
    setFormData((prev) => {
      return {
        ...prev,
        selectedLedgers: {
          ...prev.selectedLedgers,
          [ledgerId]: {
            willUnmount: false,
            splitAmount: 0,
            isLocked: false,
          },
        },
      };
    });
  }

  function deselectLedger({ ledgerId }) {
    setFormData((prev) => {
      const remainingLedgers = { ...prev.selectedLedgers };
      delete remainingLedgers[ledgerId];
      return {
        ...prev,
        selectedLedgers: remainingLedgers,
      };
    });
  }

  function submit() {
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

  function setRange(e) {
    e.target.setSelectionRange(0, 999);
  }

  function openDialog() {
    document.body.classList.add("prevent-scroll");
    setCategorySelector("open");
  }

  function closeDialog() {
    document.body.classList.remove("prevent-scroll");
    // Scroll to bottom of page after adding categories.
    window.scrollTo(0, document.body.scrollHeight);
    setCategorySelector("closed");
  }

  function toggleLedgerLock({ ledgerId }) {
    setFormData((prev) => {
      return {
        ...prev,
        selectedLedgers: {
          ...prev.selectedLedgers,
          [ledgerId]: {
            ...prev.selectedLedgers[ledgerId],
            isLocked: !prev.selectedLedgers[ledgerId].isLocked,
          },
        },
      };
    });
  }

  // Handle "escape" and "enter" keydown events.
  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        if (categorySelector == "open") {
          closeDialog();
        } else {
          // Close the form when the escape key is pressed
          navigate(-1);
        }
      } else if (key === "enter") {
        if (categorySelector == "open") {
          closeDialog();
        } else {
          // Submit the form when the enter key is pressed
          submit();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [formData, categorySelector, isFormValid]);

  useEffect(() => {
    // When transaction type changes from "income" to "expense" and vice versa
    // Purge any selected ledgers that have been flagged to unmount
    if (
      Object.values(formData.selectedLedgers).some(
        (ledgerMeta) => ledgerMeta.willUnmount
      )
    ) {
      // Set timeout to allow ledger to complete it's animation before removing
      // it from the DOM
      setTimeout(() => {
        setFormData((prev) => {
          // Make a copy of the previous selected ledgers to work with.
          const selectedLedgers = { ...prev.selectedLedgers };
          // Return an object from this method because the return value is used
          // in the spread operator.
          return {
            ...prev,
            // Iterate through the selectedLedgers key's (each key is a ledger id)
            selectedLedgers: pickBy(
              selectedLedgers,
              (ledgerMeta) => ledgerMeta.willUnmount != true
            ),
          };
        });
      }, 310);
    }
  }, [formData.type]);

  // Update isFormValid when formData changes.
  useEffect(() => {
    const isSplitTransaction = Object.keys(formData.selectedLedgers).length > 1;
    const correctBalance = isSplitTransaction
      ? Object.values(formData.selectedLedgers).reduce(
          (total, meta) => total + parseFloat(meta.splitAmount),
          0
        ) == parseFloat(formData.amount)
      : true;
    const noZeroDollarBalance = isSplitTransaction
      ? Object.values(formData.selectedLedgers).every(
          (meta) => parseFloat(meta.splitAmount) > 0
        )
      : true;
    /* prettier-ignore */
    setIsFormValid(
      formData.amount != undefined &&
      parseFloat(formData.amount) > 0.0 &&
      formData.createdAt != undefined &&
      new Date(formData.createdAt) != "Invalid Date" &&
      formData.merchant != undefined &&
      formData.merchant.trim().length > 0 &&
      Object.keys(formData.selectedLedgers).length > 0 &&
      correctBalance &&
      noZeroDollarBalance
    );
  }, [formData]);

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

        <ButtonGroup active={formData.type} setActiveTab={setActiveTab} />
      </div>
      <div className="h-full w-full pt-24 p-2 mb-24">
        <form ref={formRef} className="flex flex-col justify-start gap-2">
          <div className="w-full h-32">
            <input
              onFocus={setRange}
              type="text"
              inputMode="decimal"
              // pattern="[0-9]*"
              placeholder="$0.00"
              required
              name="amount"
              id="amount"
              value={toDollars(formData.amount)}
              onInput={(e) => {
                const value = e.target.value
                  .split("$")
                  .join("")
                  .split(",")
                  .join("");
                handleInputChange({ target: { value: value, name: "amount" } });
              }}
              min={0}
              autoFocus
              className="w-full h-full focus:ring-0 border-0 form-input text-center p-0 m-0 text-7xl font-bold bg-transparent"
            />
          </div>

          <div className="w-full flex flex-row items-center justify-end h-9 relative bg-white rounded-xl  overflow-hidden shadow-sm">
            <label
              className="bg-color-light-blue text-white rounded-xl w-4/12 flex flex-row justify-center items-center text-lg absolute left-0 h-full"
              htmlFor="date"
            >
              <p className="font-semibold">Date</p>
            </label>
            <div className="w-9/12 bg-white flex flex-row justify-center items-center">
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleInputChange}
                required
                id="date"
                className="px-0 focus:ring-0 border-0 form-input h-full text-lg placeholder:font-semibold font-semibold"
              />
            </div>
          </div>

          <div className="w-full flex flex-row items-stretch justify-end h-9 relative bg-white rounded-xl overflow-hidden shadow-sm">
            <label
              className="bg-color-light-blue text-white rounded-xl w-4/12 flex flex-row justify-center items-center text-lg absolute left-0 h-full"
              htmlFor="merchant"
            >
              <p className="font-semibold">
                {formData.type === "expense" ? "Merchant" : "Source"}
              </p>
            </label>
            <div className="w-9/12 bg-white flex flex-row justify-center items-center">
              <input
                type="text"
                onFocus={setRange}
                placeholder="Name"
                required
                id="merchant"
                name="merchant"
                value={formData.merchant}
                onInput={handleInputChange}
                className="px-0 focus:ring-0 border-0 form-input h-full text-lg w-full text-center placeholder:font-semibold font-semibold"
              />
            </div>
          </div>

          <div className="w-full flex flex-row items-stretch justify-end min-h-9 bg-white rounded-xl overflow-hidden shadow-sm">
            <textarea
              rows={2}
              placeholder="Add a note"
              value={formData.note}
              onInput={handleInputChange}
              name="note"
              className="text-left w-full focus:ring-0 border-0 form-input h-full placeholder:font-semibold flex flex-row justify-start items-center px-2 py-1"
            />
          </div>

          <div className="w-full flex flex-col items-stretch justify-start bg-white rounded-xl overflow-hidden shadow-sm px-2 py-1">
            <TagSelection preSelectedTags={undefined} key={ledgerId} />
          </div>

          <div className="w-full rounded-xl overflow-hidden px-1 py-1 bg-white flex flex-col justify-start items-stretch min-h-10 shadow-sm">
            <div className="w-full text-start px-1">
              <p className="font-semibold">Category</p>
            </div>

            {Object.keys(formData.selectedLedgers).map((ledgerId) => (
              <SelectedLedger
                ledgerId={ledgerId}
                key={ledgerId}
                deselectLedger={deselectLedger}
                willUnmount={formData.selectedLedgers[ledgerId].willUnmount}
                splitAmount={formData.selectedLedgers[ledgerId].splitAmount}
                isLocked={formData.selectedLedgers[ledgerId].isLocked}
                toggleLocked={toggleLedgerLock.bind(null, { ledgerId })}
                updateSplitAmount={updateSplitAmount}
                splitAmountRequired={
                  Object.keys(formData.selectedLedgers).length > 1
                }
              />
            ))}
            <button
              type="button"
              onClick={openDialog}
              className="w-full h-10 flex flex-row justify-start items-center gap-2 px-1"
            >
              <IoIosAdd className="rounded-full w-6 h-6 text-white bg-green-600" />
              <p className="font-semibold text-lg">Add category</p>
            </button>

            <Dialog
              closeDialog={closeDialog}
              isOpen={categorySelector === "open"}
              selectLedger={selectLedger}
              deselectLedger={deselectLedger}
              selectedLedgerIdList={Object.keys(formData.selectedLedgers)}
              transactionType={formData.type}
            />
          </div>
        </form>
      </div>
    </>
  );
}
