import React from "react";
import { useNavigate } from "react-router-dom";

// Utils
import { cap } from "../util/cap";
import { toDollars } from "../util/toDollars";

// Icons
import { HiPlus } from "react-icons/hi";
import { LuChevronRight } from "react-icons/lu";
import { LuAlertCircle } from "react-icons/lu";

// Hooks

export function ListTransaction({ transaction, isBordered }) {
  const navigate = useNavigate();

  const {
    merchant,
    type,
    amount,
    ledgerNameList,
    isCategorized,
    _id: transactionId,
  } = transaction;

  return (
    <div
      onClick={() => navigate(`/transaction/${transactionId}/details`)}
      className={`w-full flex flex-row justify-between items-stretch min-h-12 ps-2 pe-3 lg:hover:cursor-pointer bg-list-transaction-bg-color py-2 text-list-transaction-text-color ${
        isBordered && "border-b border-list-transaction-border-color"
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
      >
        <span>{type === "income" && <HiPlus className="text-xs" />}</span>
        <p>{toDollars(amount)}</p>
        <LuChevronRight className="text-xl text-list-transaction-text-color" />
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
    <p className="text-xs font-medium text-gray-400">
      {formatNames(ledgerNameList)}
    </p>
  );
}
