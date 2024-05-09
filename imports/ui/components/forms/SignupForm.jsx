import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import { Loader } from "../Loader";

export function SignupForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { inviteCode } = useParams();

  useEffect(() => {
    Meteor.call("account.validateInviteCode", { inviteCode }, (err) => {
      if (err) {
        setError(err.details);
      }
      setTimeout(() => {
        setLoading(false);
      }, 900);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());
    handleSignup(formData);
  };

  const handleSignup = (formData) => {
    Meteor.call("account.signup", { ...formData }, (err, response) => {
      if (err && err.details) {
        setValidationErrors(
          err.details.split("\n").reduce((acc, error) => {
            const [field, message] = error.split(":");
            return { ...acc, [field]: message };
          }, {})
        );
      } else if (response) {
        navigate("/login");
      }
    });
  };

  if (loading) {
    return (
      <AnimatePresence>
        <Loader key={0} />
      </AnimatePresence>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start px-2">
      {error ? (
        <div className="w-full h-screen flex flex-col justify-center">
          <div className="text-center">
            <p className="text-xl">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center py-8">
            <p className="text-2xl font-semibold">
              You have been invited to create an account
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-start gap-3 lg:w-2/5 lg:mx-auto"
          >
            <div className="flex flex-row justify-evenly items-center gap-2">
              <input
                className={`form-input w-2/4 app-form-input ${
                  validationErrors.firstName &&
                  "text-rose-400 placeholder:text-rose-400"
                }`}
                type="text"
                required
                placeholder="First name"
                name="firstName"
              />
              <input
                className={`form-input w-2/4 app-form-input ${
                  validationErrors.lastName &&
                  "text-rose-400 placeholder:text-rose-400"
                }`}
                type="text"
                required
                placeholder="Last name"
                name="lastName"
              />
            </div>
            <div>
              <input
                className={`form-input app-form-input ${
                  validationErrors.email &&
                  "text-rose-400 placeholder:text-rose-400"
                }`}
                type="email"
                required
                placeholder="Email address"
                name="email"
              />
            </div>
            <div>
              <input
                className={`form-input app-form-input ${
                  validationErrors.password &&
                  "text-rose-400 placeholder:text-rose-400"
                }`}
                type="password"
                required
                placeholder="Password"
                name="password"
              />
            </div>
            <div>
              <input
                className={`form-input app-form-input ${
                  validationErrors.confirmPassword &&
                  "text-rose-400 placeholder:text-rose-400"
                }`}
                type="password"
                required
                placeholder="Confirm password"
                name="confirmPassword"
              />
            </div>
            <input
              className="hidden"
              type="text"
              name="inviteCode"
              readOnly
              value={inviteCode}
            />
            <div className="flex flex-row justify-center items-center">
              <button className="btn-primary" type="submit">
                Create account
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
