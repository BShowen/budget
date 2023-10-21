import React from "react";
import { createBrowserRouter } from "react-router-dom";

import { Dashboard } from "../imports/ui/components/Dashboard";
import { LoginForm } from "../imports/ui/components/LoginForm";
import { Logout } from "../imports/ui/components/Logout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/signup",
    element: <h1>Signup</h1>,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);
