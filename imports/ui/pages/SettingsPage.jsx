import React, { useContext } from "react";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

// Icons
import { LuChevronRight } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { LuAlertCircle } from "react-icons/lu";
import { LuUserPlus } from "react-icons/lu";
import { LuUserCog } from "react-icons/lu";

// Utils
import { cap } from "../util/cap";

// Context
import { RootContext } from "../layouts/AppContent";

export function SettingsPage() {
  const { theme, setTheme } = useContext(RootContext);
  console.log(theme);
  const { isAdmin, firstName, lastName, email } = useTracker(() => {
    const user = Meteor.user();
    return {
      firstName: user?.profile?.firstName,
      lastName: user?.profile?.lastName,
      isAdmin: user?.profile?.isAdmin,
      email: user?.emails[0]?.address,
    };
  });

  return (
    <>
      <div className="w-full h-full p-2 pb-24 text-primary-text-color">
        <div className="h-20 flex flex-col justify-start items-start">
          <h1 className="font-bold text-3xl">
            {cap(firstName)} {cap(lastName)}
          </h1>
          <p className="text-sm font-semibold text-settings-page-email-text-color">
            {email}
          </p>
        </div>

        <div className="bg-settings-container-bg-color rounded-xl drop-shadow-sm h-8 overflow-hidden">
          <div className="flex flex-row justify-center items-center h-full font-medium">
            <button
              onClick={theme == "light" ? undefined : () => setTheme("light")}
              className={`h-full basis-0 grow ${
                theme == "light" && "bg-blue-500"
              }`}
            >
              Light
            </button>
            <button
              onClick={theme == "dark" ? undefined : () => setTheme("dark")}
              className={`h-full basis-0 grow border-x ${
                theme == "dark" && "bg-[#333333] border-[#525457]"
              }`}
            >
              Dark
            </button>
            <button
              onClick={theme == "system" ? undefined : () => setTheme("system")}
              className={`h-full basis-0 grow ${
                theme == "system" && "bg-blue-500"
              }`}
            >
              System
            </button>
          </div>
        </div>

        <p className="font-semibold text-lg py-3">Account</p>

        <div className="bg-settings-container-bg-color rounded-xl drop-shadow-sm flex flex-col items-stretch px-2 py-2 gap-2 z-0 font-medium text-lg text-settings-page-text-color">
          <Link
            to="reset-password"
            className="w-full flex flex-row justify-start items-center"
          >
            <LuSettings className="text-xl" />
            <p className="ps-1 me-auto">Reset password</p>
            <LuChevronRight className="text-xl" />
          </Link>
          <hr className="border-settings-container-border-color" />
          <Link
            to="delete-account"
            className="w-full flex flex-row justify-start items-center"
          >
            <LuAlertCircle className="text-xl" />
            <p className="ps-1 me-auto">Delete account</p>
            <LuChevronRight className="text-xl" />
          </Link>
        </div>

        {isAdmin && (
          <>
            <p className="font-semibold text-lg py-3">Users</p>
            <div className="bg-settings-container-bg-color rounded-xl drop-shadow-sm flex flex-col items-stretch px-2 py-2 gap-2 z-0 font-medium text-lg text-lg text-settings-page-text-color">
              <Link
                to="invite"
                className="w-full flex flex-row justify-start items-center"
              >
                <LuUserPlus className="text-xl" />
                <p className="ps-1 me-auto">Invite user</p>
                <LuChevronRight className="text-xl" />
              </Link>
              <hr className="border-settings-container-border-color" />
              <Link
                to="manage-users"
                className="w-full flex flex-row justify-start items-center"
              >
                <LuUserCog className="text-xl" />
                <p className="ps-1 me-auto">Manage users</p>
                <LuChevronRight className="text-xl" />
              </Link>
            </div>
          </>
        )}

        <div className="py-3">
          <Link className="btn-primary" to="/logout">
            Log out
          </Link>
        </div>
      </div>
    </>
  );
}
