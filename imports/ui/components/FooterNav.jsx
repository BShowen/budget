import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { NavLink, Link, useLocation } from "react-router-dom";

// Collections
import { TransactionCollection } from "../../api/Transaction/TransactionCollection";

// Icons
import {
  LuCircleDollarSign,
  LuListMinus,
  LuUserCircle2,
  LuLineChart,
} from "react-icons/lu";
import { CiCirclePlus } from "react-icons/ci";

export const FooterNav = () => {
  const uncategorizedTransactions = useTracker(() => {
    const transactions = TransactionCollection.find({
      isCategorized: false,
    }).fetch();
    return transactions.length;
  });

  // replace is set to true if the user is currently on a route where a
  // transaction form is rendered. This way if the user presses the back button
  // they don't have to back through multiple forms.
  const location = useLocation();
  // const replace = location.pathname.includes("transaction");
  const pattern = /\btransaction\b/;
  const replace = pattern.test(location.pathname);

  // Determine if the footer nav should be visible.
  // FooterNave should never be visible when a form is rendered.
  // const visible = location.pathname != "/new-transaction";
  const newTransactionRegex = /^\/ledger\/\w+\/transactions\/new$/;
  const isNewTransactionFormVisible =
    location.pathname == "/new-transaction" ||
    newTransactionRegex.test(location.pathname);
  const editTransactionRegex = /^\/transaction\/\w+\/edit$/;
  const isEditTransactionFormVisible = editTransactionRegex.test(
    location.pathname
  );
  // If isNewTransactionFormVisible is true then return false
  // If isEditTransactionFormVisible is true then return false
  const footerNavVisible =
    !isNewTransactionFormVisible && !isEditTransactionFormVisible;

  return (
    footerNavVisible && (
      <div className="fixed bottom-0 w-full h-[71px] bg-none">
        <div className="w-full flex flex-row flex-nowrap justify-evenly items-end h-full gooey bg-blue-200 dark:bg-dark-mode-bg-2">
          <FooterLink to="/" text="Budget">
            <LuCircleDollarSign className="text-xl" />
          </FooterLink>
          <FooterLink
            to="/transactions"
            text="Transactions"
            notifications={uncategorizedTransactions}
          >
            <LuListMinus className="text-xl" />
          </FooterLink>
          <div className="w-[80px] bg-inherit rounded-full h-full relative -top-5" />

          <FooterLink to="/insights" text="Insights">
            <LuLineChart className="text-xl" />
          </FooterLink>
          <FooterLink to="/account" text="Account">
            <LuUserCircle2 className="text-xl" />
          </FooterLink>
        </div>
        <Link
          to="/new-transaction"
          replace={replace}
          className="fixed bottom-6 w-min left-[50%] translate-x-[-50%] translate-y-1"
        >
          <CiCirclePlus className="text-color-light-blue text-7xl dark:active:text-blue-800 active:text-blue-300" />
        </Link>
      </div>
    )
  );
};

function FooterLink({ children, to, text, notifications, replace }) {
  return (
    <div className="w-1/5 flex flex-row justify-center items-stretch h-full pt-2">
      <NavLink
        to={to}
        replace={replace}
        className={({ isActive }) =>
          `${
            isActive && "text-color-light-blue"
          } h-full w-full flex flex-col items-center justify-start`
        }
      >
        {notifications > 0 && (
          <div className="relative">
            <div className="absolute -top-1 -left-4 w-3 h-3 flex flex-row justify-center items-center rounded-full bg-blue-200 dark:bg-dark-mode-bg-2 text-xs font-semibold text-white">
              <div className="w-2 h-2 flex flex-row justify-center items-center rounded-full bg-pink-600 text-xs text-white"></div>
            </div>
          </div>
        )}
        {children}
        {text && <p className="font-medium text-[11px]">{text}</p>}
      </NavLink>
    </div>
  );
}
