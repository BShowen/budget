import { ZodError } from "zod";
import { formatZodError } from "./formatZodError";
import { data } from "react-router";
import { ErrorWithClientMessage } from "../errors/ErrorWIthClientMessage";

/**
 * Handles errors that occur during route execution.
 * @throws Can throw ValidationError, Response({status: 500}) error
 */
export function handleRouteError(error: unknown) {
  // Remix throws errors to return responses.
  if (error instanceof Response) {
    return error;
  }
  // If error is a ZodError then format and return the error.
  // Throw for all other errors.
  if (error instanceof ZodError) {
    // When ValidationError is thrown, the fields are already formatted.
    return data({ fields: formatZodError(error) });
  }

  if (error instanceof ErrorWithClientMessage) {
    throw new Response(error.message, { status: 500 });
  }

  console.error("handleRouteError --> ", error);
  throw new Response("Something went wrong.", { status: 500 });
}
