import {StoreEnhancer, configureStore} from '@reduxjs/toolkit';
import authApi from '../features/auth/authApi';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import authTokenSlice from '../features/auth/authTokenSlice';
import * as Sentry from '@sentry/react-native';
import {useDispatch} from 'react-redux';
import {rbtvApiBase} from './rbtvApi';

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
      [rbtvApiBase.reducerPath]: {
        ...state[rbtvApiBase.reducerPath],
        getRbscVideoToken: '[Filtered]',
      },
    };
  },
}) as StoreEnhancer;

export const store = configureStore({
  reducer: {
    authToken: authTokenSlice,
    [authApi.reducerPath]: authApi.reducer,
    [rbtvApiBase.reducerPath]: rbtvApiBase.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 64,
      },
    })
      .concat(authApi.middleware)
      .concat(rbtvApiBase.middleware)
      .concat(() => next => action => {
        if (false && __DEV__) {
          console.debug(JSON.stringify(action));
        }
        next(action);
      }),
  enhancers: [sentryReduxEnhancer],
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
