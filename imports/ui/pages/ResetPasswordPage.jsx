import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";

export function ResetPassword() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    oldPassword: null,
    newPassword: null,
  });

  const resetPassword = ({ oldPassword, newPassword, confirmPassword }) => {
    // Send password reset info to server.
    Meteor.call(
      "account.resetPassword",
      { oldPassword, newPassword, confirmPassword },
      (error) => {
        if (error) {
          if (error.error == 500) {
            // Internal server error
            console.log("Internal server error", error);
          } else {
            const [field, message] = error.details.split(":");
            setErrors({ [field]: message });
          }
        } else {
          Meteor.logoutOtherClients(() => {
            Meteor.logout(() => {
              navigate("/login");
            });
          });
        }
      }
    );
  };

  return (
    <div className="w-full px-2">
      <div className="h-20 flex flex-col justify-center items-center">
        <h1 className="font-bold text-2xl text-gray-700">
          Reset your password
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = Object.fromEntries(new FormData(e.target).entries());
          resetPassword({ ...formData });
        }}
      >
        <div className="flex flex-col justify-start items-stretch gap-2">
          <div>
            <div className="w-full flex flex-row justify-between">
              <p>Old password</p>
              {errors.oldPassword && (
                <p className="text-rose-400">{errors.oldPassword}</p>
              )}
            </div>
            <input
              type="password"
              required
              name="oldPassword"
              placeholder="Old password"
              className={`form-input ${
                errors.oldPassword ? "border-rose-400" : ""
              }`}
            />
          </div>
          <div>
            <div className="w-full flex flex-row justify-between">
              <p>New password</p>
              {errors.password && (
                <p className="text-rose-400">{errors.password}</p>
              )}
            </div>
            <input
              type="password"
              required
              name="newPassword"
              placeholder="New password"
              className={`form-input ${
                errors.newPassword ? "border-rose-400" : ""
              }`}
            />
          </div>
          <div>
            <div className="w-full flex flex-row justify-between">
              <p>Confirm password</p>
              {errors.confirmPassword && (
                <p className="text-rose-400">{errors.confirmPassword}</p>
              )}
            </div>

            <input
              type="password"
              required
              name="confirmPassword"
              placeholder="Confirm password"
              className={`form-input ${
                errors.confirmPassword ? "border-rose-400" : ""
              }`}
            />
          </div>
          <button className="btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}
