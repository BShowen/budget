import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

// Icons
import { LuXCircle } from "react-icons/lu";
import { LuUserCircle2 } from "react-icons/lu";

export function ManageUsersPage() {
  const navigate = useNavigate();
  const isAdmin = useTracker(() => Meteor.user()?.isAdmin);
  const userList = useTracker(() => {
    return Meteor.users.find({}).fetch();
  });

  const currentUserId = Meteor.userId();

  useEffect(() => {
    // If the user is not an admin, navigate to the root url.
    // isAdmin is a reactive source. So even if the user is already on this page
    // they will be redirected immediately when there isAdmin status is changed.
    if (isAdmin == false) {
      navigate("/");
    }
  }, [isAdmin]);

  return (
    <div className="w-full h-full p-2 text-gray-700 text-center">
      <div className="h-20 flex flex-col justify-center items-center">
        <h1 className="font-bold text-2xl text-gray-700">Manage users</h1>
      </div>
      <div className="bg-white rounded-md overflow-hidden drop-shadow-sm">
        <table className="table-auto border-collapse w-full font-medium text-lg">
          <thead className="bg-slate-200 drop-shadow-sm">
            <tr className="h-10">
              <th>Name</th>
              <th>Admin</th>
              <th className="pe-2">Delete</th>
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
                  className={`h-14 border-slate-300 ${
                    i + 1 == userList.length ? "border-0" : "border-b"
                  }`}
                >
                  <td>
                    <div className="flex flex-row items-center gap-2 ps-2">
                      <LuUserCircle2 className="text-3xl h-full" />
                      <p className="font-semibold h-full">
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
                      <LuXCircle className="text-2xl md:hover:cursor-pointer md:hover:text-rose-400" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToggleAdmin({ user }) {
  const currentUserId = Meteor.userId();
  const [toggleState, setToggleState] = useState(user.isAdmin || false);

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
        className={`${checked ? "bg-sky-500" : "bg-gray-200"} 
          ${disabled ? "md:hover:cursor-not-allowed" : ""}
          relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${checked ? "translate-x-6" : "translate-x-1"} ${
            disabled ? "md:hover:cursor-not-allowed" : ""
          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-250`}
        />
      </Switch>
    </div>
  );
}
