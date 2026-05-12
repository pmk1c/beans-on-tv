import {
  Middleware,
  StoreEnhancer,
  combineSlices,
  configureStore,
  isRejected,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import * as Sentry from "@sentry/react-native";
import { AppState, AppStateStatus, NativeEventSubscription, Platform } from "react-native";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

import { rbtvApi } from ".././rbtvApi";
import { authTokenSlice } from "../../features/auth/authTokenSlice";
import { captureError } from "../capture";
import { rbtvSocketApiSlice } from "../rbtvApi/rbtvSocketApiSlice";

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  actionTransformer: (action) => {
    if (
      action.payload &&
      typeof action.type === "string" &&
      action.type.toLowerCase().includes("token")
    ) {
      return {
        ...action,
        payload: "[Filtered]",
      };
    }

    return action;
  },
  stateTransformer: (state: RootState) => {
    return {
      ...state,
      authToken: "[Filtered]",
      [rbtvApi.reducerPath]: {
        ...state[rbtvApi.reducerPath],
        getRbscVideoToken: "[Filtered]",
      },
    };
  },
}) as StoreEnhancer;

const captureRejectedMiddleware: Middleware = () => (next) => (action: unknown) => {
  if (isRejected(action)) {
    if (action.error.name === "ConditionError") return;

    captureError(action.error);
  }

  return next(action);
};

const reducer = combineSlices(rbtvApi, authTokenSlice, rbtvSocketApiSlice);

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 64,
      },
    })
      .concat(rbtvApi.middleware)
      .concat(captureRejectedMiddleware),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers()
      .concat(sentryReduxEnhancer)
      .concat(
        __DEV__
          ? [
              devToolsEnhancer({
                name: Platform.OS,
              }),
            ]
          : [],
      ),
});

let initialized = false;
setupListeners(store.dispatch, (dispatch, { onFocus, onFocusLost }) => {
  let subscription: NativeEventSubscription | undefined;

  if (!initialized) {
    subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        dispatch(onFocus());
      } else {
        dispatch(onFocusLost());
      }
    });
    initialized = true;
  }

  const unsubscribe = () => {
    subscription?.remove();
    initialized = false;
  };

  return unsubscribe;
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
