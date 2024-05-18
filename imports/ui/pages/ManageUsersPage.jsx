import { Meteor } from "meteor/meteor";
import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Switch } from "@headlessui/react";
import { useNavigate, Link } from "react-router-dom";

// Icons
import { LuXCircle } from "react-icons/lu";
import { LuUserCircle2 } from "react-icons/lu";

export function ManageUsersPage() {
  const navigate = useNavigate();
  const isAdmin = useTracker(() => Meteor.user()?.profile?.isAdmin);
  const userList = useTracker(() => {
    return Meteor.users.find({}).fetch();
  });

  const currentUserId = Meteor.userId();

  useEffect(() => {
    // If the user is not an admin, navigate to the root url.
    // isAdmin is a reactive source. So even if the user is already on this page
    // they will be redirected immediately when there isAdmin status is changed.
    if (!isAdmin) {
      navigate("/account");
    }
  }, [isAdmin]);

  return (
    <>
      {userList.length > 1 ? (
        <>
          <div className="h-10 flex flex-col justify-center items-center">
            <h1 className="font-bold text-2xl">Manage users</h1>
          </div>
          <div className="bg-white dark:bg-dark-mode-bg-1 rounded-md overflow-hidden drop-shadow-sm">
            <table className="table-auto border-collapse w-full text-lg">
              <thead className="bg-slate-200 dark:bg-dark-mode-bg-1 dark:border-b dark:border-b-dark-mode-bg-2">
                <tr className="h-10 text-sm">
                  <th className="font-semibold">Name</th>
                  <th className="font-semibold">Admin</th>
                  <th className="font-semibold">Delete</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, i) => {
                  {
                    /* Don't show current user. */
                  }
                  if (user._id == currentUserId) return;
                  return (
                    <tr
                      key={user._id}
                      className={`h-14 border-slate-300 dark:border-dark-mode-bg-2 ${
                        i + 1 == userList.length ? "border-0" : "border-b"
                      }`}
                    >
                      <td>
                        <div className="flex flex-row items-center gap-2 ps-2">
                          <LuUserCircle2 className="text-3xl h-full stroke-1" />
                          <p className="h-full">
                            {user.profile.firstName} {user.profile.lastName}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="w-full flex flex-row justify-center items-center">
                          <ToggleAdmin user={user} />
                        </div>
                      </td>
                      <td>
                        <div className="w-full flex flex-row justify-center items-center">
                          <RemoveUserButton user={user} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="h-10 flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl">No users to manage</h1>
          </div>
          <div className="overflow-hidden text-center p-3">
            <Link
              to="../invite"
              className="text-lg font-semibold text-sky-500 underline"
            >
              Invite a user
            </Link>
          </div>
        </>
      )}
    </>
  );
}

function ToggleAdmin({ user }) {
  const currentUserId = Meteor.userId();
  const [toggleState, setToggleState] = useState(user.profile.isAdmin || false);

  const toggleAdminRole = () => {
    if (currentUserId == user._id) {
      return;
    } else {
      Meteor.call(
        "account.updateRole",
        { userId: user._id, adminStatus: !toggleState },
        (err, result) => {
          if (err) {
            return;
          } else if (result != undefined) {
            setToggleState(result);
          }
        }
      );
    }
  };

  return (
    <Toggle
      onToggle={toggleAdminRole}
      checked={toggleState}
      disabled={currentUserId == user._id}
    />
  );
}

function Toggle({ onToggle, checked, disabled }) {
  return (
    <div className="flex flex-col justify-center h-full">
      <Switch
        disabled={disabled}
        checked={checked}
        onChange={() => {
          onToggle();
        }}
        className={`${
          checked ? "bg-primary-blue" : "bg-gray-200 dark:bg-dark-mode-bg-3"
        } 
          ${disabled ? "md:hover:cursor-not-allowed" : ""}
          relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${checked ? "translate-x-6" : "translate-x-1"} ${
            disabled ? "md:hover:cursor-not-allowed" : ""
          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-250`}
        />
      </Switch>
    </div>
  );
}

function RemoveUserButton({ user }) {
  const removeAccount = () => {
    const confirmation = confirm(
      "Are your sure you want to delete this account?"
    );
    if (confirmation) {
      Meteor.call("account.removeUserAccount", { targetUserId: user._id });
    }
  };
  return (
    <LuXCircle
      onClick={removeAccount}
      className="text-2xl md:hover:cursor-pointer md:hover:text-rose-400"
    />
  );
}
