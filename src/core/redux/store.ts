import {
  Middleware,
  StoreEnhancer,
  combineSlices,
  configureStore,
  isRejected,
} from "@reduxjs/toolkit";
import * as Sentry from "@sentry/react-native";
import { Platform } from "react-native";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

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

const reducer = combineSlices(authTokenSlice, rbtvSocketApiSlice);

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 64,
      },
    }).concat(captureRejectedMiddleware),
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
