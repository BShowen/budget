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
import { ErrorPage } from "../imports/ui/pages/ErrorPage";
import { InvitationPage } from "../imports/ui/pages/InvitationPage";
import { ResetPassword } from "../imports/ui/pages/ResetPasswordPage";
import { DeleteAccount } from "../imports/ui/pages/DeleteAccountPage";
import { ManageUsersPage } from "../imports/ui/pages/ManageUsersPage";
import { AccountPageLayout } from "../imports/ui/pages/AccountPageLayout";

// Loaders
import { logoutLoader } from "../imports/ui/components/Logout";

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
    element: <Layout />,
    errorElement: <ErrorPage />,
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
        children: [
          {
            index: true,
            element: <AccountPage />,
          },
          {
            path: "invite",
            element: (
              <AccountPageLayout>
                <InvitationPage />
              </AccountPageLayout>
            ),
          },
          {
            path: "reset-password",
            element: (
              <AccountPageLayout>
                <ResetPassword />
              </AccountPageLayout>
            ),
          },
          {
            path: "delete-account",
            element: (
              <AccountPageLayout>
                <DeleteAccount />
              </AccountPageLayout>
            ),
          },
          {
            path: "manage-users",
            element: (
              <AccountPageLayout>
                <ManageUsersPage />
              </AccountPageLayout>
            ),
          },
        ],
      },
      {
        path: "/insights",
        element: <p>Nothing to see here.</p>,
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
