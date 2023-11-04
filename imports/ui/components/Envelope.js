import { Meteor } from "meteor/meteor";
import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { LedgerCollection } from "../../api/Ledger/LedgerCollection";
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Utils
import { cap } from "../util/cap";
import { decimal } from "../util/decimal";
import { reduceTransactions } from "../util/reduceTransactions";
import { formatDollarAmount } from "../util/formatDollarAmount";

// Components
import { Ledger } from "./Ledger";

export const Envelope = ({ _id, name, activeTab }) => {
  const { ledgers } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Return the ledgers that belong to this envelope
    const ledgers = LedgerCollection.find({
      envelopeId: _id,
    }).fetch();

    return { ledgers };
  });

  const { transactions } = useTracker(() => {
    if (!Meteor.userId()) return {};
    // Return the transactions that are in this envelope
    const transactions = TransactionCollection.find({
      envelopeId: _id,
    }).fetch();
    return { transactions };
  });
  const calculatedEnvelopeBalance = ledgers.reduce((total, ledger) => {
    return total + ledger.startingBalance;
  }, 0);

  const { expense, income } = reduceTransactions({ transactions });
  const spent = expense - income;

  const remaining = calculatedEnvelopeBalance - spent;
  const displayBalance =
    activeTab === "spent"
      ? spent
      : activeTab === "remaining"
      ? remaining
      : calculatedEnvelopeBalance;

  const progress =
    activeTab === "spent"
      ? (spent / calculatedEnvelopeBalance) * 100
      : activeTab === "remaining"
      ? (remaining / calculatedEnvelopeBalance) * 100
      : 0;

  return (
    // Envelope container
    <div className="bg-white rounded-lg shadow-md flex flex-col items-stretch px-2 pt-1 pb-2 gap-2 relative z-0">
      <EnvelopeHeader name={name} activeTab={activeTab} progress={progress} />
      <EnvelopeBody ledgers={ledgers} activeTab={activeTab} />
      <EnvelopeFooter displayBalance={displayBalance} envelopeId={_id} />
    </div>
  );
};

function EnvelopeHeader({ name, activeTab }) {
  return (
    <div className="flex flex-row justify-between p-1 px-2 h-8 rounded-md overflow-hidden items-center relative z-0 w-full">
      <h1 className="font-bold relative z-50">{cap(name)}</h1>
      <h2 className="font-semibold relative z-50">{cap(activeTab)}</h2>
    </div>
  );
}

function EnvelopeBody({ ledgers, activeTab }) {
  return (
    <div className="flex flex-col gap-2 z-20">
      {ledgers.map((ledger, i) => {
        return <Ledger key={i} {...ledger} activeTab={activeTab} />;
      })}
    </div>
  );
}

function EnvelopeFooter({ displayBalance, envelopeId }) {
  const [isForm, setFormState] = useState(false);
  const toggleForm = () => {
    setFormState((prev) => !prev);
  };
  const component = isForm ? (
    <NewLedgerForm toggleForm={toggleForm} envelopeId={envelopeId} />
  ) : (
    <div className="w-full flex flex-row justify-between items-center">
      <p
        onClick={() => {
          if (!isForm) {
            toggleForm();
          }
        }}
        className="font-normal lg:hover:cursor-pointer"
      >
        Add item
      </p>
      <h2 className="font-medium">{decimal(displayBalance)}</h2>
    </div>
  );

  return (
    <div
      className={`flex flex-row items-center px-2 h-8 rounded-md ${
        isForm ? "bg-slate-100" : ""
      }`}
    >
      {component}
    </div>
  );
}

function NewLedgerForm({ toggleForm, envelopeId }) {
  const [state, setState] = useState({
    envelopeId: envelopeId,
    name: "",
    startingBalance: "",
  });
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    // Close the form when the escape key is pressed
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        toggleForm();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleInput(e) {
    const name = e.target.name;
    const value =
      name === "startingBalance"
        ? formatDollarAmount(e.target.value)
        : e.target.value;
    setState((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (state.name) {
      // Submit
      try {
        Meteor.call("ledger.createLedger", state);
      } catch (error) {
        console.log(error);
      }
    }
    // Reset the form state
    setState((prev) => ({
      ...prev,
      name: "",
      startingBalance: "",
    }));
    toggleForm();
  }

  function handleKeyDown(e) {
    // Submit form when enter key is pressed
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission
      handleSubmit(); // Trigger your form submission logic
    }
  }

  return (
    <div className="w-full h-full">
      <form className="w-full flex flex-row justify-between h-full">
        <input
          className="focus:ring-0 border-0 w-1/3 h-full p-0 m-0 bg-inherit font-semibold"
          name="name"
          placeholder="Item name"
          autoFocus
          value={state.name}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          // onFocus get clear the timeout that is stored in state
          onFocus={() => clearTimeout(timeoutId)}
          // onBlur start a timeout and store its ID in state
          onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
        />
        <input
          className="focus:ring-0 border-0 w-1/3 h-full p-0 m-0 bg-inherit text-right"
          name="startingBalance"
          placeholder="$0.00"
          pattern="[0-9]*"
          value={state.startingBalance}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          // onFocus get clear the timeout that is stored in state
          onFocus={() => clearTimeout(timeoutId)}
          // onBlur start a timeout and store its ID in state
          onBlur={() => setTimeoutId(setTimeout(handleSubmit, 10))}
        />
      </form>
    </div>
  );
}

// function divideAndRoundToNearestTens(balance, n) {
//   const baseProduct = (balance / n).toFixed(2);
//   const balances = [];
//   if ((baseProduct * n).toFixed(2) == balance) {
//     for (let i = 0; i < n; i++) {
//       balances.push(baseProduct);
//     }
//     return balances;
//   } else {
//     for (let i = 0; i < n; i++) {
//       if (i === 0) {
//         const product = ((baseProduct * 100 + 1) / 100).toFixed(2);
//         balances.push(product);
//       } else {
//         balances.push(baseProduct);
//       }
//     }
//     return balances;
//   }
// }
