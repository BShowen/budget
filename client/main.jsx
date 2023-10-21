import React, { StrictMode } from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes.js";

function App({ router }) {
  return (
    <div className="w-full lg:w-3/4 mx-auto overflow-hidden">
      <RouterProvider router={router} />
    </div>
  );
}

Meteor.startup(() => {
  const root = createRoot(document.getElementById("app"));
  root.render(
    <StrictMode>
      <App router={router} />
    </StrictMode>
  );
});
