import React, { useState, useContext, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { EnvelopeCollection } from "../../api/Envelope/EnvelopCollection";

// Components
import { Modal } from "./Modal";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Utils
import { cap } from "../util/cap";
import { reduceLedgers } from "../util/reduceLedgers";
import { reduceTransactions } from "../util/reduceTransactions";
import { decimal } from "../util/decimal";
import { dates } from "../util/dates";

// Context
import { DashboardContext } from "../pages/Dashboard";

// Icons
import { IoIosArrowBack } from "react-icons/io";
import { HiMinus, HiPlus } from "react-icons/hi";
import { BiDollar, BiCheck, BiX } from "react-icons/bi";

export const LedgerTransactions = ({ isOpen, onClose, ledger }) => {
  const { toggleLedger, envelopeId } = useContext(DashboardContext);
  const { transactions, envelope } = useTracker(() => {
    if (!Meteor.userId() || !isOpen) return {};

    const envelope = EnvelopeCollection.findOne({ _id: envelopeId });
    const allLedgers = LedgerCollection.find({
      _id: { $in: envelope.ledgers },
    }).fetch();
    envelope.ledgers = allLedgers;
    envelope.ledgers.forEach((ledger) => {
      const populatedTransactions = TransactionCollection.find({
        _id: { $in: ledger.transactions },
      }).fetch();
      ledger.transactions = populatedTransactions;
    });
    const { income, expense } = reduceLedgers({ ledgers: envelope.ledgers });
    envelope.expense = expense;
    envelope.income = income;

    // Find the ledger in order to render it's transactions.
    const reactiveLedger = LedgerCollection.findOne({ _id: ledger._id });
    const transactions = TransactionCollection.find({
      _id: { $in: reactiveLedger.transactions },
    }).fetch();
    return { transactions, envelope };
  }, []);

  const [percentSpent, setPercentSpent] = useState(0);
  const [{ income, expense }, setIncomeExpense] = useState({
    income: 0,
    expense: 0,
  });

  useEffect(() => {
    const spent = expense - income;
    const percentSpent = ledger.startingBalance
      ? (spent / ledger.startingBalance) * 100
      : (spent / envelope.startingBalance) * 100;
    setPercentSpent(percentSpent);
  }, [income, expense]);

  useEffect(() => {
    if (!transactions) return;
    setIncomeExpense(reduceTransactions({ transactions }));
  }, [transactions]);

  if (!isOpen) return null;

  const spent = expense - income;
  const remaining = ledger.startingBalance
    ? ledger.startingBalance - spent
    : envelope.startingBalance - (envelope.expense - envelope.income);

  const logo =
    remaining == 0 ? (
      <BiCheck className="text-4xl text-emerald-400" />
    ) : remaining < 0 ? (
      <BiX className="text-5xl text-rose-400" />
    ) : (
      <BiDollar
        className={`text-3xl ${
          spent > ledger.startingBalance ? "text-rose-400" : "text-emerald-400"
        }`}
      />
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="overflow-scroll fixed top-0 bottom-0 bg-slate-100 w-full">
        <div className="bg-sky-500 text-white px-1 pt-3 pb-8 z-50 sticky top-0">
          <div
            className="text-left text-xl font-bold pb-3 px-2 flex flex-row items-center justify-start"
            onClick={() => {
              toggleLedger({ ledger: {} });
            }}
          >
            <IoIosArrowBack className="text-2xl" /> Back
          </div>
          <div className="bg-sky-700/50 grid grid-cols-12 rounded-lg w-11/12 mx-auto p-1 px-2 h-14 relative">
            <div className="col-start-1 col-span-6 h-fit text-start">
              <h2 className="text-xl font-bold">{cap(ledger.name)}</h2>
              {/* prettier-ignore */}
              <p className="text-xs font-semibold">
                {`${decimal(spent)} spent of ${decimal(ledger.startingBalance || envelope.startingBalance)}`}
              </p>
            </div>
            <div className="col-start-8 col-span-3 text-end h-fit">
              <p className="text-xs font-semibold">Remaining</p>
              <p
                className={`text-lg font-semibold ${
                  spent > ledger.startingBalance && "text-rose-400"
                }`}
              >
                {decimal(remaining)}
              </p>
            </div>
            <div className="col-start-11 col-span-2 absolute -right-6 -top-2">
              <div className="w-[70px] h-[70px] rounded-full ">
                <CircularProgressbarWithChildren
                  value={percentSpent}
                  background
                  backgroundPadding={6}
                  styles={buildStyles({
                    backgroundColor: "#0387C5",
                    pathColor:
                      spent > ledger.startingBalance ? "#fb7185" : "#34d399",
                    trailColor: "transparent",
                  })}
                >
                  {logo}
                </CircularProgressbarWithChildren>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 p-2">
          <div className="bg-white shadow-md py-0 rounded-lg px-3">
            {transactions.map((transaction, i) => {
              const border = i === 0 ? "" : "border-t";
              const [month, day] = dates
                .format(transaction.createdAt, {
                  forTransaction: true,
                })
                .split(" ");
              return (
                <div
                  key={transaction._id}
                  className={`${border} border-slate-300 p-1 flex flex-row flex-nowrap items-center gap-2`}
                >
                  <div className="basis-0 ">
                    <div className="border-4 rounded-full p-0 font-semibold text-gray-400 w-12 h-12 flex flex-col justify-center items-center">
                      <p className="text-sm">{month}</p>
                      <p className="text-xs">{day}</p>
                    </div>
                  </div>
                  <div className="basis-0 grow ps-1">
                    <p className="font-semibold text-gray-700 text-lg">
                      {cap(transaction.merchant)}
                    </p>
                    <p className="text-sm text-gray-400 font-semibold">
                      Logged by {cap(transaction.loggedBy.firstName)}
                    </p>
                  </div>
                  <div className="text-md text-slate-700 font-semibold flex flex-row items-center gap-1">
                    <span>
                      {transaction.type === "expense" ? (
                        <HiMinus className="text-red-500" />
                      ) : (
                        <HiPlus className="text-green-500" />
                      )}
                    </span>
                    <p>{decimal(transaction.amount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
