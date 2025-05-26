import { ZodError, type ZodIssue } from "zod";

export type FormattedZodError = {
  [key: string]: { message?: string } | FormattedZodError;
};

function formatZodIssue(issue: ZodIssue, acc: FormattedZodError): FormattedZodError {
  const field = issue.path[0].toString();
  if (issue.path.length > 1) {
    return {
      [field]: {
        ...acc[field],
        ...formatZodIssue({ ...issue, path: issue.path.slice(1) }, (acc[field] as FormattedZodError) || {}),
      },
    };
  } else {
    return {
      ...acc,
      [field]: { message: issue.message },
    };
  }
}

export function formatZodError(error: ZodError): FormattedZodError {
  const results = error.issues.reduce((acc: FormattedZodError, issue: ZodIssue) => {
    return { ...acc, ...formatZodIssue(issue, acc) };
  }, {} as FormattedZodError);
  return results;
}
