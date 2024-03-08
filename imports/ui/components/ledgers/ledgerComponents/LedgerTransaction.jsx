import React from "react";
import { Link } from "react-router-dom";

// Utils
import { cap } from "../../../util/cap";
import { toDollars } from "../../../util/toDollars";

// Icons
import { HiMinus, HiPlus } from "react-icons/hi";
import { LuChevronRight } from "react-icons/lu";
export function LedgerTransaction({
  transaction,
  ledgerId,
  transactionId,
  options,
}) {
  const defaultOptions = { border: "", month: "", day: "" };
  const { border, month, day } = { ...defaultOptions, ...options };
  return (
    <Link
      to={`/ledger/${ledgerId}/transaction/${transactionId}/edit`}
      className={`${border} border-slate-300 p-1 flex flex-row flex-nowrap items-center gap-2 lg:hover:cursor-pointer`}
    >
      <div className="basis-0 ">
        <div className="border-4 rounded-full p-0 font-semibold text-gray-400 w-12 h-12 flex flex-col justify-center items-center">
          <p className="text-sm">{month}</p>
          <p className="text-xs">{day}</p>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <p className="font-semibold text-md truncate">
          {cap(transaction.merchant)}
        </p>
        <p className="text-sm text-gray-400 font-semibold">
          Logged by {cap(transaction.loggedBy.firstName)}
        </p>
      </div>
      <div className="text-md font-semibold flex flex-row items-center gap-1">
        <span>
          {transaction.type === "expense" ? (
            <HiMinus className="text-red-500" />
          ) : (
            <HiPlus className="text-green-500" />
          )}
        </span>
        <p>{toDollars(transaction.amount)}</p>
        <LuChevronRight className="text-2xl text-gray-500" />
      </div>
    </Link>
  );
}
