import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { redirect, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const loginFormLoader = () => {
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
export function LoginForm() {
  const navigate = useNavigate();
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

    Meteor.loginWithPassword(
      { email: formValues.email },
      formValues.password,
      (error) => {
        if (error) {
          if (error.reason.toLowerCase() == "user not found") {
            setError({ field: "email", reason: "Invalid email" });
          } else if (error.reason.toLowerCase() == "incorrect password") {
            setError({ field: "password", reason: "Invalid password" });
          }
        } else {
          navigate("/");
        }
      }
    );
  }

  function handleInput(e) {
    setFormValues((prevValues) => {
      return {
        ...prevValues,
        [e.target.name]: e.target.value,
      };
    });
  }

  return (
    <>
      <div className="empty-page-header !bg-gray-100"></div>
      <div className="w-full bg-inherit p-2 flex flex-col justify-start items-stretch gap-7 padding-safe-area-top">
        <div className="w-full h-14 flex flex-col justify-end items-center">
          <h1 className="text-3xl font-semibold">Login to Dough Tracker</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-3 lg:w-2/5 lg:mx-auto"
        >
          <div>
            <input
              className={`form-input border ${
                error.field === "email" ? "border-rose-400" : "border-gray-300"
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
              className={`form-input border ${
                error.field === "password"
                  ? "border-rose-400"
                  : "border-gray-300"
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
              Log In
            </button>
          </div>
          {/* <div className="flex flex-row justify-start items-center px-2">
            <p>
              Don't have an account?{" "}
              <span>
                <Link className="underline text-sky-500">Sign up</Link>
              </span>
            </p>
          </div>
          <div className="flex flex-row justify-start items-center px-2">
            <a
              className="underline text-sky-500 hover:cursor-pointer"
              onClick={() => {
                Meteor.loginWithPassword(
                  { email: Meteor.settings.public.demoAccount.email },
                  Meteor.settings.public.demoAccount.password,
                  (error) => {
                    if (error) {
                      alert("Sorry, demo isn't available right now.");
                    } else {
                      navigate("/");
                    }
                  }
                );
              }}
            >
              Try a demo
            </a>
          </div> */}
        </form>
      </div>
    </>
  );
}
