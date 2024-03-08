import "/imports/startup/client";
import React, { StrictMode } from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// router
import { router } from "./router";

// Components
import { AppData } from "../imports/ui/layouts/AppData.jsx";

Meteor.startup(() => {
  const root = createRoot(document.getElementById("app"));
  root.render(
    <StrictMode>
      <AppData>
        <RouterProvider router={router} />
      </AppData>
    </StrictMode>
  );
});
