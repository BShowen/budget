import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Toaster } from "sonner";
import { useDynamicToastPosition } from "./utils/hooks/useDynamicToastPosition";
import { ClerkProvider } from "@clerk/react-router";
import { rootAuthLoader } from "@clerk/react-router/ssr.server";

import "./app.css";

export function loader(args: LoaderFunctionArgs) {
  return rootAuthLoader(args);
}

export default function Root() {
  const position = useDynamicToastPosition();
  const loaderData = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width, user-scalable=no" />
        <title>Dough Tracker</title>
        <meta name="description" content="Track your transactions." />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Dough Tracker" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <ClerkProvider loaderData={loaderData}>
          <Outlet />
        </ClerkProvider>
        <ScrollRestoration />
        <Scripts />
        <Toaster
          position={position}
          mobileOffset={{ bottom: "10px", right: "10px", top: "env(safe-area-inset-top)", left: "10px" }}
          closeButton={position == "bottom-right"}
        />
      </body>
    </html>
  );
}
