import { Meteor } from "meteor/meteor";
import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";

// Components
import { LoginForm, loginFormLoader } from "../imports/ui/components/LoginForm";
import { Dashboard } from "../imports/ui/pages/Dashboard";
import { LedgerTransactions } from "../imports/ui/components/LedgerTransactions";
import { TransactionForm } from "../imports/ui/components/TransactionForm";

const checkLoginStatus = () => {
  return Meteor.userId() ? null : redirect("/login");
};

export const router = createBrowserRouter([
  {
    path: "/",
    loader: checkLoginStatus,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/ledger/:ledgerId/transactions",
        element: <LedgerTransactions />,
      },
      {
        path: "/ledger/:ledgerId/transactions/new",
        element: <TransactionForm />,
      },
    ],
  },
  {
    path: "/login",
    loader: loginFormLoader,
    element: <LoginForm />,
  },
]);
