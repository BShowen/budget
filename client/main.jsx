import "/imports/startup/client";
import React, { StrictMode } from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// router
import { router } from "./router";

// Utils
import "../imports/ui/util/appHeight.js";

Meteor.startup(() => {
  const root = createRoot(document.getElementById("app"));
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
});
