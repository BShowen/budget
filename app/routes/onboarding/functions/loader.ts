// Npm packages
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";

import prisma from "~/prisma/client";

export async function loader(args: LoaderFunctionArgs) {
  //   Get the userId from the session
  const { userId } = await getAuth(args);

  // User is not signed in
  if (!userId) return redirect("/sign-in");

  // See if user is associated with an Account
  const account = await prisma.account.findFirst({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });

  // User has already been onboarded
  if (account) return redirect("/budget");

  // Create a new Account and associate this user with it.
  await prisma.account.create({
    data: {
      users: {
        create: {
          id: userId,
        },
      },
    },
  });

  return redirect("/budget");
}
