import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Switch } from "@headlessui/react";

// Icons
import { LuXCircle } from "react-icons/lu";
import { LuUserCircle2 } from "react-icons/lu";

export function ManageUsersPage() {
  const userList = useTracker(() => {
    return Meteor.users.find({}).fetch();
  });

  return (
    <div className="w-full h-full p-2 text-gray-700 text-center">
      <div className="h-20 flex flex-col justify-center items-center">
        <h1 className="font-bold text-2xl text-gray-700">Manage users</h1>
      </div>
      <div className="bg-white rounded-md overflow-hidden drop-shadow-sm">
        <table class="table-auto border-collapse w-full font-medium text-lg">
          <thead className="bg-slate-200 drop-shadow-sm">
            <tr className="h-10">
              <th>Name</th>
              <th>Admin</th>
              <th className="pe-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, i) => {
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
                      <Toggle />
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

function Toggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col justify-center h-full">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-sky-500" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-250`}
        />
      </Switch>
    </div>
  );
}
