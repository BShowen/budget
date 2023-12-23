import React from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

// Icons
import { LuChevronRight } from "react-icons/lu";
import { LuClipboardList } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { LuAlertCircle } from "react-icons/lu";
import { LuUserPlus } from "react-icons/lu";
import { LuUserCog } from "react-icons/lu";

export function AccountPage() {
  const {
    isAdmin,
    profile: { firstName, lastName },
  } = useTracker(() => {
    return Meteor.user();
  });

  return (
    <div className="w-full h-full p-2 text-gray-700">
      <div className="h-20 flex flex-col justify-start items-start">
        <p className="text-sm font-semibold">Logged in as</p>
        <h1 className="font-bold text-3xl text-gray-700">
          {firstName} {lastName}
        </h1>
      </div>
      <p className="font-semibold text-lg py-3">Account settings</p>
      <div className="bg-white rounded-lg drop-shadow-sm flex flex-col items-stretch px-2 py-2 gap-2 relative z-0 font-medium text-lg">
        <Link className="w-full flex flex-row justify-start items-center">
          <LuClipboardList className="text-xl" />
          <p className="ps-1 me-auto">Reconcile</p>
          <LuChevronRight className="text-xl" />
        </Link>
        <hr />
        <Link
          to="reset-password"
          className="w-full flex flex-row justify-start items-center"
        >
          <LuSettings className="text-xl" />
          <p className="ps-1 me-auto">Reset password</p>
          <LuChevronRight className="text-xl" />
        </Link>
        <hr />
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
          <p className="font-semibold text-lg py-3">User settings</p>
          <div className="bg-white rounded-lg drop-shadow-sm flex flex-col items-stretch px-2 py-2 gap-2 relative z-0 font-medium text-lg">
            <Link
              to="invite"
              className="w-full flex flex-row justify-start items-center"
            >
              <LuUserPlus className="text-xl" />
              <p className="ps-1 me-auto">Invite user</p>
              <LuChevronRight className="text-xl" />
            </Link>
            <hr />
            <Link
              to="manage-users"
              className="w-full flex flex-row justify-start items-center"
            >
              <LuUserCog className="text-xl" />
              <p className="ps-1 me-auto">Manage user accounts</p>
              <LuChevronRight className="text-xl" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
