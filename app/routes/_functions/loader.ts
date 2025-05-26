import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect, type LoaderFunctionArgs } from "react-router";

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await getAuth(args);
  if (userId) {
    return redirect("/dashboard");
  }
}
