import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
export function InvitationPage() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const getInvitationLink = () => {
    setLoading(true);
    Meteor.call("account.generateSignupUrl", null, async (err, response) => {
      setLoading(false);
      setUrl(response);
    });
  };

  const shareInvitationLink = () => {
    setLoading(true);
    Meteor.call("account.generateSignupUrl", null, async (err, response) => {
      setLoading(false);
      if (response) {
        const shareOptions = {
          title: "Dough Tracker Invitation.",
          text: "You're invited to Dough Tracker.",
          url: url,
        };
        // Navigator is not supported in Chrome yet.
        if (
          !!navigator && //Check if navigator is defined
          navigator.canShare && //Check if navigator.canShare is defined
          navigator.canShare(shareOptions) //Check if can share
        ) {
          // navigator.share() will not fail.
          navigator.share(shareOptions);
        } else {
          // Cannot use navigator.share() so instead, display the link for the
          // user to copy and paste.
          setUrl(response);
        }
      }
    });
  };

  if (Meteor.user().isAdmin) {
    if (url) {
      return (
        <div className="px-2">
          <p className="font-medium font-gray-700">
            Share this link with someone to grant them access to your budget.
          </p>
          <div className="border rounded-md bg-white h-10 w-full overflow-x-scroll select-text grid grid-cols-12 overflow-clip">
            <div
              className={`col-start-1 overflow-x-scroll flex flex-row justify-start items-center px-1 ${
                navigator.clipboard ? "col-span-10" : "col-span-12"
              }`}
            >
              <p
                className="p-0 m-0"
                onClick={(e) => {
                  // Highlight the url when clicked on.
                  if (window.getSelection) {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(e.target);
                    selection.removeAllRanges();
                    selection.addRange(range);
                  }
                }}
              >
                {url}
              </p>
            </div>
            {navigator.clipboard && (
              <div className="col-start-11 col-span-2 bg-white flex flex-row justify-center items-center border-s">
                <button
                  className="font-semibold"
                  onClick={() => {
                    // Copy text when copy button is clicked.
                    if (navigator && navigator.clipboard) {
                      navigator.clipboard.writeText(url);
                    }
                  }}
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      );
    } else if (navigator.canShare) {
      return (
        <div className="px-2">
          <button
            className={`${
              loading ? "text-gray-400 bg-sky-600" : "text-white bg-sky-500"
            } w-full text-center font-medium text-lg mt-4 rounded-md py-2 shadow-sm active:text-gray-400 active:bg-sky-600`}
            onClick={shareInvitationLink}
          >
            Share invitation link
          </button>
        </div>
      );
    } else {
      return (
        <div className="px-2">
          <button
            className={`${
              loading ? "text-gray-400 bg-sky-600" : "text-white bg-sky-500"
            } w-full text-center font-medium text-lg mt-4 rounded-md py-2 shadow-sm active:text-gray-400 active:bg-sky-600`}
            onClick={getInvitationLink}
          >
            Get Invitation Link
          </button>
        </div>
      );
    }
  }
}
