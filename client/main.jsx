import React, { StrictMode } from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes.js";
import { Layout } from "../imports/ui/pages/Layout.jsx";

function App({ router }) {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
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
