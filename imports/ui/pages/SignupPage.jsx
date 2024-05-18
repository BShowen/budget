import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import { Loader } from "../components/Loader";
import { SignupForm } from "../components/forms/SignupForm";

export function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isValidInvite, setIsValidInvite] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const { inviteCode } = useParams();

  useEffect(() => {
    if (!inviteCode) {
      setTimeout(() => {
        setLoading(false);
      }, 900);
      return;
    }
    Meteor.call("account.validateInviteCode", { inviteCode }, (err) => {
      if (err) {
        setIsValidInvite(false);
      }
      setTimeout(() => {
        setLoading(false);
      }, 900);
    });
  }, []);

  useEffect(() => {
    document.body.classList.add("prevent-scroll");
    document.documentElement.classList.add("prevent-scroll");
    return () => {
      document.body.classList.remove("prevent-scroll");
      document.documentElement.classList.remove("prevent-scroll");
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());
    if (inviteCode) {
      formData.inviteCode = inviteCode;
    }
    handleSignup(formData);
  };

  const handleSignup = (formData) => {
    setIsCreatingAccount(true);
    Meteor.call("account.signup", { ...formData }, (err) => {
      if (!err) navigate("/login");
      setTimeout(() => {
        if (err?.reason === "invalidInviteCode") {
          // Alert the user that something went wrong please check the link and try again.
          console.log("Invalid invite code.");
        } else if (err?.reason === "invalidAccessCode") {
          console.log("Invalid access code.");
        } else if (err?.reason === "undefinedCode") {
          console.log("No access.");
          // Do nothing.
          // An access code or invite code will be sent if the user is using the
          // UI. The only way a code isn't sent is if the user is using a tool
          // like curl or they're tampering with the form.
          return;
        } else if (err?.details) {
          setValidationErrors(
            err.details.split("\n").reduce((acc, isValidInvite) => {
              const [field, message] = isValidInvite.split(":");
              return { ...acc, [field]: message };
            }, {})
          );
        }
        setIsCreatingAccount(false);
      }, 1000);
    });
  };

  if (loading) {
    return (
      <AnimatePresence>
        <Loader key={0} />
      </AnimatePresence>
    );
  }

  return !isValidInvite ? (
    <div className="w-full h-screen flex flex-col justify-center">
      <div className="text-center">
        <p className="text-xl font-medium dark:text-dark-mode-text-1">
          Your invitation link has expired.
        </p>
      </div>
    </div>
  ) : (
    <div className="w-full bg-inherit flex flex-col justify-center items-stretch gap-7 padding-top-safe-area height-full lg:w-2/5 lg:mx-auto">
      <div className="w-full h-14 flex flex-col justify-end items-center">
        <h1 className="text-3xl font-semibold dark:text-dark-mode-text-1">
          {inviteCode
            ? "You have been invited to create an account!"
            : "Signup"}
        </h1>
      </div>

      <div>
        <SignupForm
          isLoading={isCreatingAccount}
          onSubmit={handleSubmit}
          validationErrors={validationErrors}
          // When invite code is false, an access code is required to sign up.
          requiresAccessCode={!inviteCode}
        />
        <div className="flex flex-row justify-start items-center px-2 py-3">
          <p>
            Have an account?{" "}
            <span>
              <Link to="/login" className="text-sky-600">
                Login
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
