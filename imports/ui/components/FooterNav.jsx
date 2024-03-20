import React, { useContext } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

// Context
import { RootContext } from "../layouts/AppData";

// Icons
import {
  LuCircleDollarSign,
  LuListMinus,
  LuUserCircle2,
  LuLineChart,
} from "react-icons/lu";
import { IoIosAddCircle } from "react-icons/io";

export const FooterNav = () => {
  const rootContext = useContext(RootContext);
  const { uncategorizedTransactions } = rootContext;

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
  const regex = /^\/ledger\/\w+\/transactions\/new$/gm;
  const isNewTransactionFormVisible = location.pathname == "/new-transaction";
  const isEditTransactionFormVisible = regex.test(location.pathname);
  // If isNewTransactionFormVisible is true then return false
  // If isEditTransactionFormVisible is true then return false
  const footerNavVisible =
    !isNewTransactionFormVisible && !isEditTransactionFormVisible;

  return (
    footerNavVisible && (
      <div className="fixed bottom-0 w-full h-20 lg:w-3/5 mx-auto bg-white">
        <div className="w-full flex flex-row flex-nowrap justify-evenly items-end h-full gooey bg-inherit">
          <FooterLink to="/" text="Budget">
            <LuCircleDollarSign className="text-inherit w-full h-full" />
          </FooterLink>
          <FooterLink
            to="/transactions"
            text="Transactions"
            notifications={uncategorizedTransactions}
          >
            <LuListMinus className="text-inherit w-full h-full" />
          </FooterLink>
          <div className="w-[70px] bg-inherit rounded-full h-full relative -top-4" />

          <FooterLink to="/insights" text="Insights">
            <LuLineChart className="text-inherit w-full h-full" />
          </FooterLink>
          <FooterLink to="/account" text="Account">
            <LuUserCircle2 className="text-inherit w-full h-full" />
          </FooterLink>
        </div>
        <Link
          to="/new-transaction"
          replace={replace}
          className="fixed bottom-6 w-min left-[50%] translate-x-[-50%]"
        >
          <IoIosAddCircle className="text-color-light-blue text-7xl" />
        </Link>
      </div>
    )
  );
};

function FooterLink({ children, to, text, notifications }) {
  return (
    <div className="w-1/6 flex flex-row justify-center items-stretch h-full pt-3">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${
            isActive ? "text-color-light-blue text-sm" : "text-xs "
          } flex flex-col items-center px-3`
        }
      >
        <div className="w-6 h-6 relative">
          {notifications > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 flex flex-row justify-center items-center rounded-full bg-pink-600 text-xs font-extrabold text-white">
              <p>{notifications}</p>
            </div>
          )}
          {children}
        </div>
        <p className="font-semibold text-inherit">{text}</p>
      </NavLink>
    </div>
  );
}
