import React from "react";
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

export function AccountPage() {
  const { isAdmin, firstName, lastName, email } = useTracker(() => {
    const user = Meteor.user();
    return {
      firstName: user?.profile?.firstName,
      lastName: user?.profile?.lastName,
      isAdmin: user?.isAdmin,
      email: user?.emails[0]?.address,
    };
  });

  return (
    <>
      <div className="w-full h-full p-2 pb-24 text-color-primary">
        <div className="h-20 flex flex-col justify-start items-start">
          <h1 className="font-bold text-3xl text-gray-700 dark:text-dark-mode-text-0">
            {cap(firstName)} {cap(lastName)}
          </h1>
          <p className="text-sm font-semibold">{email}</p>
        </div>
        <p className="font-semibold text-lg py-3 dark:text-dark-mode-text-0">
          Account settings
        </p>
        <div className="bg-white dark:bg-dark-mode-bg-1 dark:text-dark-mode-text-1 rounded-xl drop-shadow-sm flex flex-col items-stretch px-2 py-2 gap-2 z-0 font-medium text-lg">
          <Link
            to="reset-password"
            className="w-full flex flex-row justify-start items-center"
          >
            <LuSettings className="text-xl" />
            <p className="ps-1 me-auto">Reset password</p>
            <LuChevronRight className="text-xl" />
          </Link>
          <hr className="dark:border-dark-mode-bg-2" />
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
            <p className="font-semibold text-lg py-3 dark:text-dark-mode-text-0">
              User settings
            </p>
            <div className="bg-white dark:bg-dark-mode-bg-1 dark:text-dark-mode-text-1 rounded-xl drop-shadow-sm flex flex-col items-stretch px-2 py-2 gap-2 z-0 font-medium text-lg">
              <Link
                to="invite"
                className="w-full flex flex-row justify-start items-center"
              >
                <LuUserPlus className="text-xl" />
                <p className="ps-1 me-auto">Invite user</p>
                <LuChevronRight className="text-xl" />
              </Link>
              <hr className="dark:border-dark-mode-bg-2" />
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
