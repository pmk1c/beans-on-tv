import {
  StoreEnhancer,
  combineSlices,
  configureStore,
  isRejected,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import * as Sentry from "@sentry/react-native";
import {
  AppState,
  AppStateStatus,
  NativeEventSubscription,
  Platform,
} from "react-native";

import { rbtvApi } from ".././rbtvApi";
import authApi from "../../features/auth/authApi";
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
      [authApi.reducerPath]: {
        ...state[authApi.reducerPath],
        getToken: "[Filtered]",
        refreshToken: "[Filtered]",
      },
      [rbtvApi.reducerPath]: {
        ...state[rbtvApi.reducerPath],
        getRbscVideoToken: "[Filtered]",
      },
    };
  },
}) as StoreEnhancer;

const reducer = combineSlices(
  authApi,
  rbtvApi,
  authTokenSlice,
  rbtvSocketApiSlice
);

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 64,
      },
    })
      .concat(authApi.middleware)
      .concat(rbtvApi.middleware)
      .concat(() => (next) => (action) => {
        if (isRejected(action)) {
          if (action.error.name === "ConditionError") return;

          captureError(action.error);
        }

        next(action);
      }),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers()
      .concat(sentryReduxEnhancer)
      .concat(
        __DEV__
          ? [
              require("redux-devtools-expo-dev-plugin").default({
                name: Platform.OS,
              }),
            ]
          : []
      ),
});

let initialized = false;
setupListeners(store.dispatch, (dispatch, { onFocus, onFocusLost }) => {
  let subscription: NativeEventSubscription;

  if (!initialized) {
    subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          dispatch(onFocus());
        } else {
          dispatch(onFocusLost());
        }
      }
    );
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
