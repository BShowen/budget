import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";

export function LoginForm() {
  let [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    Meteor.loginWithPassword("user", "pass", (error) =>
      setErrorMessage(error?.reason || "")
    );
  }, []);

  return (
    <div>
      <h1>Logged in.</h1>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
