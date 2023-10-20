import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { RouterProvider } from "react-router-dom";

import { router } from "../imports/startup/client/routes.js";

function AppRoot({ router }) {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

Meteor.startup(() => {
  render(<AppRoot router={router} />, document.getElementById("app"));
});
