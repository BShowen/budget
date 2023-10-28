import React, { StrictMode } from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";

import { Layout } from "../imports/ui/pages/Layout.jsx";
import { Splash } from "../imports/ui/pages/Splash.jsx";

Meteor.startup(() => {
  const root = createRoot(document.getElementById("app"));
  root.render(
    <StrictMode>
      <Layout>
        <Splash />
      </Layout>
    </StrictMode>
  );
});
