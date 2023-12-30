import {
  StoreEnhancer,
  combineSlices,
  configureStore,
  isAction,
} from '@reduxjs/toolkit';
import authApi from '../../features/auth/authApi';
import {setupListeners} from '@reduxjs/toolkit/query/react';
import {authTokenSlice} from '../../features/auth/authTokenSlice';
import * as Sentry from '@sentry/react-native';
import {useDispatch} from 'react-redux';
import {rbtvApi} from '.././rbtvApi';
import {rbtvSocketApiSlice} from '../rbtvApi/rbtvSocketApiSlice';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  actionTransformer: action => {
    if (
      action.payload &&
      typeof action.type === 'string' &&
      action.type.toLowerCase().includes('token')
    ) {
      return {
        ...action,
        payload: '[Filtered]',
      };
    }

    return action;
  },
  stateTransformer: (state: RootState) => {
    return {
      ...state,
      authToken: '[Filtered]',
      [authApi.reducerPath]: {
        ...state[authApi.reducerPath],
        getToken: '[Filtered]',
        refreshToken: '[Filtered]',
      },
      [rbtvApi.reducerPath]: {
        ...state[rbtvApi.reducerPath],
        getRbscVideoToken: '[Filtered]',
      },
    };
  },
}) as StoreEnhancer;

const reducer = combineSlices(
  authApi,
  rbtvApi,
  authTokenSlice,
  rbtvSocketApiSlice,
);

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 64,
      },
    })
      .concat(authApi.middleware)
      .concat(rbtvApi.middleware)
      .concat(() => next => action => {
        if (__DEV__ && isAction(action)) {
          if ('payload' in action) {
            console.debug('Redux action', action.type, action.payload);
          } else {
            console.debug('Redux action', action.type);
          }
        }

        next(action);
      }),
  enhancers: getDefaultEnhancers =>
    getDefaultEnhancers().concat(sentryReduxEnhancer),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
