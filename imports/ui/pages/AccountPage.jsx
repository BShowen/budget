import React, { useState } from "react";
import { Meteor } from "meteor/meteor";

export function AccountPage() {
  const [url, setUrl] = useState("");

  const getInvitationLink = () => {
    Meteor.call("account.generateSignupUrl", null, (err, response) => {
      if (response) {
        setUrl(response);
      }
    });
  };

  return (
    <div className="w-full h-full">
      {Meteor.user().isAdmin && (
        <button
          className="bg-sky-500 lg:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md lg:focus:shadow-outline text-lg"
          onClick={getInvitationLink}
        >
          Invite a user
        </button>
      )}
      <a href={url} target="_blank" className="select-text">
        {url}
      </a>
    </div>
  );
}
