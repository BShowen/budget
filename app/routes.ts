import { type RouteConfig, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// export default flatRoutes() satisfies RouteConfig;
export default [
  route("sign-in/*", "./routes/sign-in/route.tsx"),
  route("sign-up/*", "./routes/sign-up/route.tsx"),
  ...(await flatRoutes()),
];
