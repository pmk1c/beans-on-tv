import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import capture from "../../core/capture";
import { AppDispatch } from "../../core/redux/store";

import { authClient } from "../../lib/auth-client";
import { getRbtvToken } from "./betterAuthToken";
import {
  resetAuthToken,
  selectAuthToken,
  selectAuthTokenInitialized,
  setAuthToken,
} from "./authTokenSlice";

const DEVICE_CLIENT_ID = process.env.EXPO_PUBLIC_BETTER_AUTH_DEVICE_CLIENT_ID!;
const DEVICE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";

type AuthScreenState =
  | {
      step: "creatingCode" | "done";
    }
  | {
      step: "pollingToken";
      deviceCode: string;
      intervalMs: number;
      code: string;
    };

function useCreateCodeStep() {
  return useCallback(() => {
    return authClient.device.code({
      client_id: DEVICE_CLIENT_ID,
      scope: "user.email.read user.info rbsc.video.token",
    });
  }, []);
}

function usePollAuthTokenStep() {
  const dispatch = useDispatch<AppDispatch>();

  const tokenPollingTimeout = useRef<number>(null);
  const stopPolling = () => {
    if (tokenPollingTimeout.current) {
      window.clearTimeout(tokenPollingTimeout.current);
    }
  };
  useEffect(() => {
    return stopPolling;
  }, []);

  return useCallback(
    ({ deviceCode, intervalMs }: { deviceCode: string; intervalMs: number }) => {
      return new Promise((resolve) => {
        const pollToken = async () => {
          const { data, error } = await authClient.device.token({
            grant_type: DEVICE_GRANT_TYPE,
            device_code: deviceCode,
            client_id: DEVICE_CLIENT_ID,
          });

          if (data?.access_token) {
            const token = await getRbtvToken({
              authorization: `Bearer ${data.access_token}`,
            });
            if (token) {
              stopPolling();
              await dispatch(setAuthToken(token));
              resolve(undefined);
              return;
            }
          }

          if (!error || error.error === "authorization_pending" || error.error === "slow_down") {
            tokenPollingTimeout.current = window.setTimeout(() => {
              capture(pollToken());
            }, intervalMs);
            return;
          }

          stopPolling();
          resolve(undefined);
        };

        capture(pollToken());
      });
    },
    [dispatch],
  );
}

function useLogout() {
  const dispatch = useDispatch<AppDispatch>();

  return () => dispatch(resetAuthToken());
}

export function useAuthScreen() {
  const [state, setState] = useState<AuthScreenState>({
    step: "creatingCode",
  });
  const authTokenInitialized = useSelector(selectAuthTokenInitialized);
  const authToken = useSelector(selectAuthToken);
  const createCode = useCreateCodeStep();
  const pollAuthToken = usePollAuthTokenStep();

  useEffect(() => {
    console.log("useAuthScreen effect", { authToken, authTokenInitialized, step: state.step });
    if (!authTokenInitialized) {
      return;
    }

    if (authToken) {
      setState({ step: "done" });
      return;
    }

    if (state.step !== "creatingCode") {
      return;
    }

    capture(
      (async () => {
        const { data } = await createCode();
        console.log("createCode result", { data });
        if (!data?.user_code || !data.device_code) {
          return;
        }

        const intervalMs = Math.max(1000, (data.interval ?? 5) * 1000);
        setState({
          step: "pollingToken",
          code: data.user_code,
          deviceCode: data.device_code,
          intervalMs,
        });
        await pollAuthToken({
          deviceCode: data.device_code,
          intervalMs,
        });
      })(),
    );
  }, [authToken, authTokenInitialized, createCode, pollAuthToken, state.step]);

  const logoutAction = useLogout();
  const logout = useCallback(() => {
    capture(logoutAction());
    setState({ step: "creatingCode" });
  }, [logoutAction]);

  return { state, logout };
}
