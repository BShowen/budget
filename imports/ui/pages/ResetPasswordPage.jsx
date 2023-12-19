import React from "react";

export function ResetPassword() {
  const handleSubmit = () => {
    // Send password reset info to server.
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
          handleSubmit(e);
        }}
      >
        <div className="flex flex-col justify-start items-stretch gap-2">
          <input
            type="password"
            required
            name="oldPassword"
            placeholder="Old password"
            className="form-input"
          ></input>
          <input
            type="password"
            required
            name="newPassword"
            placeholder="New password"
            className="form-input"
          ></input>
          <button className="btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}
