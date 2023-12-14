import React, { useEffect } from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../util/isLoggedIn";
export function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  useEffect(() => {
    // If the user is not logged in, just redirect to login page
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, []);

  // If the user is logged in, then display the error message
  return isLoggedIn() && <p>Something went wrong...{error.message}</p>;
}
