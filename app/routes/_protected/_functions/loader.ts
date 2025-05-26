// Utils
import { authRoute, type LoaderArgs } from "~/utils/functions/authRoute";

import prisma from "~/prisma/client";
import { redirect } from "react-router";

export const loader = authRoute(async ({ user }: LoaderArgs) => {
  // Check to see if user is associated with an account.
  const activeUser = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  });
  if (activeUser) {
    // If yes, continue
    return;
  } else {
    // If no, redirect to onboarding.
    return redirect("/onboarding");
  }
});
