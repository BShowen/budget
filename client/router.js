import { Meteor } from "meteor/meteor";
import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";

// Components
import { LoginForm, loginFormLoader } from "../imports/ui/components/LoginForm";
import { TransactionForm } from "../imports/ui/components/TransactionForm";
import { Layout } from "../imports/ui/pages/Layout";

// Pages
import { Dashboard } from "../imports/ui/pages/Dashboard";
import { TransactionsList } from "../imports/ui/components/TransactionsList";
import { SignupForm } from "../imports/ui/components/SignupForm";
import { AccountPage } from "../imports/ui/pages/AccountPage";

const checkLoginStatus = () => (Meteor.userId() ? null : redirect("/login"));

export const router = createBrowserRouter([
  {
    path: "/",
    loader: checkLoginStatus,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/ledger/:ledgerId/transactions",
        element: <TransactionsList />,
      },
      {
        path: "/ledger/:ledgerId/transactions/new",
        element: <TransactionForm />,
      },
      {
        path: "/ledger/:ledgerId/transaction/:transactionId/edit",
        element: <TransactionForm />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
    ],
  },
  {
    path: "/login",
    loader: loginFormLoader,
    element: <LoginForm />,
  },
  {
    path: "/:inviteCode/signup",
    element: <SignupForm />,
  },
]);
