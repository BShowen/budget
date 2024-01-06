import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

export function InvitationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const isAdmin = useTracker(() => Meteor.user()?.isAdmin);

  useEffect(() => {
    // If the user is not an admin, navigate to the root url.
    // isAdmin is a reactive source. So even if the user is already on this page
    // they will be redirected immediately when there isAdmin status is changed.
    if (isAdmin == false) {
      navigate("/account");
    }
  }, [isAdmin]);

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
          url: response,
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

  return (
    <>
      <div className="h-10 flex flex-col justify-center items-center">
        <h1 className="font-bold text-2xl">Invite a user</h1>
      </div>
      {url && (
        <div>
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
      )}
      {navigator.canShare ? (
        <button className="btn-primary mt-4 py-2" onClick={shareInvitationLink}>
          Share invitation link
        </button>
      ) : (
        <button className="btn-primary mt-4 py-2" onClick={getInvitationLink}>
          Get Invitation Link
        </button>
      )}
    </>
  );
}
