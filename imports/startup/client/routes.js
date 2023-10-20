import React from "react";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Hello world!</h1>,
  },
  {
    path: "/login",
    element: <h1>Login</h1>,
  },
  {
    path: "/signup",
    element: <h1>Signup</h1>,
  },
]);
