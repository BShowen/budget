import React, { useState } from "react";

// Icons
import { LuInfo } from "react-icons/lu";

// Components
import { LineWobble } from "../LineWobble";

export function SignupForm({
  isLoading,
  onSubmit,
  validationErrors,
  requiresAccessCode = false,
} = {}) {
  return (
    <div className="w-full flex flex-col justify-start px-2">
      <form onSubmit={onSubmit} className="flex flex-col justify-start gap-3">
        <div className="flex flex-row justify-evenly items-center gap-2">
          <input
            className={`form-input w-2/4 app-form-input ${
              validationErrors?.firstName &&
              "text-rose-400 placeholder:text-rose-400"
            }`}
            type="text"
            required
            placeholder="First name"
            name="firstName"
          />
          <input
            className={`form-input w-2/4 app-form-input ${
              validationErrors?.lastName &&
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
              validationErrors?.email &&
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
              validationErrors?.password &&
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
              validationErrors?.confirmPassword &&
              "text-rose-400 placeholder:text-rose-400"
            }`}
            type="password"
            required
            placeholder="Confirm password"
            name="confirmPassword"
          />
        </div>
        {requiresAccessCode && <AccessCodeInput />}
        <div className="flex flex-row justify-center items-center">
          <button className="btn-primary" type="submit">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-full">
                <p>Creating account...</p>
                <LineWobble width={150} />
              </div>
            ) : (
              "Create account"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function AccessCodeInput({ validationErrors }) {
  const [isShowingMessage, setIsShowingMessage] = useState(false);
  const toggleMessage = () => {
    setIsShowingMessage(true);
    setTimeout(() => {
      setIsShowingMessage(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <div
        className="h-full absolute right-0 flex flex-row justify-center items-center w-10 rounded-e-md  dark:text-dark-mode-text-1 dark:active:text-dark-mode-text-0"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleMessage();
        }}
      >
        <LuInfo className="text-xl" />
        {isShowingMessage && (
          <div className="absolute right-8 w-[130px]">
            <p className="text-xs font-medium dark:text-dark-mode-text-0">
              This app is invite only.
            </p>
          </div>
        )}
      </div>
      <input
        className={`form-input app-form-input ${
          validationErrors?.accessCode &&
          "text-rose-400 placeholder:text-rose-400"
        }`}
        type="text"
        required
        placeholder="Invitation code"
        name="accessCode"
      />
    </div>
  );
}
