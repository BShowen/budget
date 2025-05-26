import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "react-router";
import { handleRouteError } from "./handleRouteError";
import { createClerkClient } from "@clerk/react-router/api.server";
import { getAuth, type User } from "@clerk/react-router/ssr.server";

/**
 * A higher-order function to wrap loaders and actions with authentication.
 * @param handler The actual action logic to be executed after auth.
 * @param role The role required for this loader/action.
 * @returns A new function that includes authorization and error handling.
 */

export type LoaderArgs = LoaderFunctionArgs & {
  user: User;
};

export type ActionArgs = ActionFunctionArgs & {
  user: User;
};

export function authRoute<T>(handler: (args: LoaderArgs | ActionArgs) => Promise<T>) {
  return async function (args: LoaderArgs | ActionArgs): Promise<T> {
    const { userId } = await getAuth(args);

    if (!userId) {
      // If there is no user then there is no session and this request needs to be terminated.
      throw redirect("/");
    }

    const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(userId);

    try {
      // User is authenticated. Proceed with execution on this route.
      return await handler({ ...args, user });
    } catch (error) {
      // This function handles all errors that occur in the loader/action functions.
      // I chose to place error handling here to keep my loaders and actions DRY.
      // If error handling isn't done here then I need to implement this try-catch block in every single
      // loader and action with the same exact implementation.
      return handleRouteError(error) as T;
    }
  };
}
