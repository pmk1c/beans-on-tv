import * as Sentry from "@sentry/react-native";

export function captureError(error: unknown) {
  console.error(error);
  Sentry.captureException(error);
}

function capture(error: Error): void;
function capture(promise: Promise<unknown>): void;

function capture(errorOrPromise: Error | Promise<unknown>) {
  if (errorOrPromise instanceof Error) {
    captureError(errorOrPromise);
  } else {
    errorOrPromise.catch(captureError);
  }
}

export default capture;
