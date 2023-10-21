import React from "react";
import { createBrowserRouter, Outlet, redirect } from "react-router-dom";

import { Dashboard } from "../imports/ui/components/Dashboard";
import { LoginForm } from "../imports/ui/components/LoginForm";
import { logout } from "../imports/ui/util/logout";

function authenticate() {
  if (!Meteor.userId()) {
    return redirect("/login");
  }
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    loader: authenticate,
    children: [
      // Routes defined in this array are protected.
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/signup",
    element: <h1>To-do: Implement signup form.</h1>,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/logout",
    loader: logout,
  },
]);
