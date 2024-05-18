import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { redirect, useNavigate, Link } from "react-router-dom";

// Components
import { LineWobble } from "../components/LineWobble";

export const loginPageLoader = () => {
  // If user is logged in, redirect to budget.
  if (Meteor.loggingOut()) {
    // If user is logging out
    return null;
  } else if (Meteor.userId() && !Meteor.loggingOut()) {
    // If userId is true and user is not logging out.
    return redirect("/");
  } else {
    return null;
  }
};
export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  function blurInputs() {
    // Manually blur html inputs.
    document.getElementById("email").blur();
    document.getElementById("password").blur();
  }

  function handleSubmit(e) {
    e.preventDefault();
    blurInputs();
    if (!formValues.email) {
      setError({});
      return;
    }
    setIsLoading(true);
    Meteor.loginWithPassword(
      { email: formValues.email },
      formValues.password,
      (error) => {
        // setTimeout is used to prevent the loader from flickering when loading
        // times are fast.
        setTimeout(() => {
          if (error) {
            if (error.reason.toLowerCase() == "user not found") {
              setError({ field: "email", reason: "Invalid email" });
            } else if (error.reason.toLowerCase() == "incorrect password") {
              setError({ field: "password", reason: "Invalid password" });
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
            navigate("/");
          }
        }, 1000);
      }
    );
  }

  function handleInput(e) {
    setError((prev) => {
      if (prev.field == e.target.name) {
        return {};
      } else {
        return prev;
      }
    });
    setFormValues((prevValues) => {
      return {
        ...prevValues,
        [e.target.name]: e.target.value,
      };
    });
  }

  useEffect(() => {
    document.body.classList.add("prevent-scroll");
    document.documentElement.classList.add("prevent-scroll");
    return () => {
      document.body.classList.remove("prevent-scroll");
      document.documentElement.classList.remove("prevent-scroll");
    };
  });

  return (
    <div className="w-full bg-inherit flex flex-col justify-center items-stretch gap-7 padding-top-safe-area height-full lg:w-2/5 lg:mx-auto">
      <div className="w-full h-14 flex flex-col justify-end items-center">
        <h1 className="text-3xl font-semibold dark:text-dark-mode-text-1">
          Login to Dough Tracker
        </h1>
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-3 w-full px-2"
        >
          <div>
            <input
              className={`form-input app-form-input ${
                error.field === "email" ? "text-red-500" : ""
              }`}
              id="email"
              type="email"
              required
              placeholder="Email"
              name="email"
              value={formValues.email}
              onInput={handleInput}
            />
          </div>
          <div>
            <input
              className={`form-input app-form-input border ${
                error.field === "password" ? "text-red-500" : ""
              }`}
              id="password"
              type="password"
              required
              placeholder="Password"
              name="password"
              value={formValues.password}
              onInput={handleInput}
            />
          </div>
          <div className="flex flex-row justify-center items-center">
            <button className="btn-primary py-2 px-4" type="submit">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-full">
                  <p>Logging in...</p>
                  <LineWobble width={100} />
                </div>
              ) : (
                <p>Login</p>
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-row justify-start items-center px-2 py-3">
          <p>
            Don't have an account?{" "}
            <span>
              <Link to="/signup" className="text-sky-600">
                Sign up
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
