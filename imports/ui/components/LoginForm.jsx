import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

export function LoginForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const loggedInUser = useTracker(Meteor.userId);
  useEffect(() => {
    // Redirect the user when they're logged in
    if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!formValues.email) {
      setErrorMessage("");
      return;
    }

    Meteor.loginWithPassword(
      { email: formValues.email },
      formValues.password,
      (error) => {
        if (error) {
          setErrorMessage(error?.reason || "");
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
    <div className="w-full max-w-xs mx-auto">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            required
            placeholder="Email"
            name="email"
            value={formValues.email}
            onInput={handleInput}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            required
            placeholder="Password"
            name="password"
            value={formValues.password}
            onInput={handleInput}
          />
          {errorMessage && (
            <p className="text-red-500 text-xs italic">{errorMessage}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            // href="#"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}
