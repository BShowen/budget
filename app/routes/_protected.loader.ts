import { authRoute, type LoaderArgs } from "~/utils/functions/authRoute";

export const loader = authRoute(async ({ user }: LoaderArgs) => {
  console.log("Authed", user.fullName);
  return true;
});
