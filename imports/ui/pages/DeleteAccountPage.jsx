import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { LuAlertCircle } from "react-icons/lu";
export function DeleteAccount() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ password: null });

  const deleteAccount = ({ password }) => {
    Meteor.call("account.deleteAccount", { password }, (error) => {
      if (error) {
        const [field, message] = error.details.split(":");
        setErrors({ [field]: message });
      } else {
        Meteor.logoutOtherClients(() => {
          Meteor.logout(() => {
            navigate("/login");
          });
        });
      }
    });
  };

  return (
    <div className="w-full h-full p-2 text-gray-700 text-center">
      <div className="h-20 flex flex-col justify-center items-center">
        <h1 className="font-bold text-2xl text-gray-700">
          Delete your account
        </h1>
        <div className="flex flex-row justify-center items-center font-medium text-rose-500 gap-2">
          <LuAlertCircle className="text-xl" />
          <p>Deleting your account cannot be undone.</p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = Object.fromEntries(new FormData(e.target).entries());
          deleteAccount({ ...formData });
        }}
        className="flex flex-col justify-start gap-2"
      >
        <div className="flex flex-row justify-between items-center">
          <label htmlFor="password" className="font-semibold">
            Account password
          </label>
          {errors.password && (
            <p className="text-rose-500">{errors.password}</p>
          )}
        </div>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
          className={`form-input ${errors.password ? "border-rose-400" : ""}`}
        />

        <button className="btn-primary">Delete my account</button>
      </form>
    </div>
  );
}
