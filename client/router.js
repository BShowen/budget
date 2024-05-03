import { Meteor } from "meteor/meteor";
import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";

// Components
import {
  LoginForm,
  loginFormLoader,
} from "../imports/ui/components/forms/LoginForm";
import { TransactionForm } from "../imports/ui/components/forms/TransactionForm";

// Pages
import { Dashboard } from "../imports/ui/pages/Dashboard";
import { LedgerTransactionsPage } from "../imports/ui/pages/LedgerTransactionsPage";
import { SignupForm } from "../imports/ui/components/forms/SignupForm";
import { AccountPage } from "../imports/ui/pages/AccountPage";
import { ErrorPage } from "../imports/ui/pages/ErrorPage";
import { InvitationPage } from "../imports/ui/pages/InvitationPage";
import { ResetPassword } from "../imports/ui/pages/ResetPasswordPage";
import { DeleteAccount } from "../imports/ui/pages/DeleteAccountPage";
import { ManageUsersPage } from "../imports/ui/pages/ManageUsersPage";
import { AccountPageLayout } from "../imports/ui/layouts/AccountPageLayout";
import { TransactionListPage } from "../imports/ui/pages/TransactionListPage";
import { NewAllocationPage } from "../imports/ui/pages/NewAllocationPage";
import { InsightsPage } from "../imports/ui/pages/InsightsPage";
import { TransactionDetailsPage } from "../imports/ui/pages/TransactionDetailsPage";

// Loaders
import { App } from "../imports/ui/layouts/App";
import { logoutLoader } from "../imports/ui/components/Logout";
import { editTransactionLoader } from "../imports/ui/components/forms/TransactionForm";

const checkLoginStatus = () => {
  if (Meteor.loggingOut()) {
    return redirect("/login");
  } else if (Meteor.userId()) {
    return null;
  } else {
    return redirect("/login");
  }
};

export const router = createBrowserRouter([
  {
    path: "/",
    loader: checkLoginStatus,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/ledger/:ledgerId/transactions",
        element: <LedgerTransactionsPage />,
      },
      {
        path: "/ledger/:ledgerId/transactions/new",
        element: <TransactionForm />,
      },
      {
        path: "/account",
        element: <AccountPageLayout />,
        children: [
          {
            index: true,
            element: <AccountPage />,
          },
          {
            path: "invite",
            element: <InvitationPage />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
          {
            path: "delete-account",
            element: <DeleteAccount />,
          },
          {
            path: "manage-users",
            element: <ManageUsersPage />,
          },
        ],
      },
      {
        path: "/transaction/:transactionId/edit",
        element: <TransactionForm />,
        loader: editTransactionLoader,
      },
      {
        path: "/transaction/:transactionId/details",
        element: <TransactionDetailsPage />,
      },
      {
        path: "/transactions",
        element: <TransactionListPage />,
      },
      {
        path: "/insights",
        element: <InsightsPage />,
      },
      {
        path: "/new-allocation",
        element: <NewAllocationPage />,
      },
      {
        path: "/new-transaction",
        element: <TransactionForm />,
      },
    ],
  },
  {
    path: "/login",
    loader: loginFormLoader,
    element: <LoginForm />,
  },
  {
    path: "/logout",
    loader: logoutLoader,
  },
  {
    path: "/:inviteCode/signup",
    element: <SignupForm />,
  },
]);
