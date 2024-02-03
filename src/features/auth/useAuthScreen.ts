import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useCreateCodeMutation, useGetTokenMutation } from "./authApi";
import {
  resetAuthToken,
  selectAuthToken,
  selectAuthTokenInitialized,
  setAuthToken,
} from "./authTokenSlice";
import capture from "../../app/capture";
import { AppDispatch } from "../../app/redux/store";

type AuthScreenState =
  | {
      step: "creatingCode" | "done";
    }
  | {
      step: "pollingToken";
      code: string;
    };

function useCreateCodeStep() {
  const [createCode] = useCreateCodeMutation();

  return useCallback(() => {
    return createCode().unwrap();
  }, [createCode]);
}

function usePollAuthTokenStep() {
  const [getToken] = useGetTokenMutation();
  const dispatch = useDispatch<AppDispatch>();

  const tokenPollingTimeout = useRef<NodeJS.Timeout>();
  const stopPolling = () => {
    if (tokenPollingTimeout.current) {
      clearTimeout(tokenPollingTimeout.current);
    }
  };
  useEffect(() => {
    return stopPolling;
  }, []);
  return useCallback(
    (code: string) => {
      return new Promise((resolve) => {
        const pollToken = async () => {
          const token = await getToken(code).unwrap();
          if (token) {
            stopPolling();
            await dispatch(setAuthToken(token));
            resolve(undefined);
          } else {
            tokenPollingTimeout.current = setTimeout(
              () => capture(pollToken()),
              1000,
            );
          }
        };
        capture(pollToken());
      });
    },
    [dispatch, getToken],
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
        const code = await createCode();
        setState({ step: "pollingToken", code });
        await pollAuthToken(code);
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
