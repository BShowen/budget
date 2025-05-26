import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  layout("./routes/_protected/_layout.tsx", [route("budget", "./routes/_protected/budget/route.tsx")]),
  route("sign-in/*", "./routes/sign-in/route.tsx"),
  route("sign-up/*", "./routes/sign-up/route.tsx"),
] satisfies RouteConfig;
