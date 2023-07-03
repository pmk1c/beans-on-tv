import {configureStore} from '@reduxjs/toolkit';
import authApi from '../features/auth/authApi';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import authTokenSlice, {
  initializeAuthToken,
} from '../features/auth/authTokenSlice';
import rbtvApi from '../features/latestVideos/rbtvApi';
import * as Sentry from '@sentry/react-native';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  actionTransformer: action => {
    if (action.type.toLowerCase().includes('token')) {
      return {
        ...action,
        payload: 'REDACTED',
      };
    }

    return action;
  },
  stateTransformer: state => {
    return {
      ...state,
      authToken: 'REDACTED',
      [authApi.reducerPath]: {
        ...state[authApi.reducerPath],
        getToken: 'REDACTED',
        refreshToken: 'REDACTED',
      },
      [rbtvApi.reducerPath]: {
        ...state[rbtvApi.reducerPath],
        getRbscVideoToken: 'REDACTED',
      },
    };
  },
});

export const store = configureStore({
  reducer: {
    authToken: authTokenSlice,
    [authApi.reducerPath]: authApi.reducer,
    [rbtvApi.reducerPath]: rbtvApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 64,
      },
    })
      .concat(authApi.middleware)
      .concat(rbtvApi.middleware)
      .concat(() => next => action => {
        console.debug(JSON.stringify(action));
        next(action);
      }),
  enhancers: [sentryReduxEnhancer],
});
setupListeners(store.dispatch);

store.dispatch(initializeAuthToken());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
