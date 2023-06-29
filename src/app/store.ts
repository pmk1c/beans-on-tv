import {configureStore} from '@reduxjs/toolkit';
import authApi from '../features/auth/authApi';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import authTokenSlice, {
  initializeAuthToken,
} from '../features/auth/authTokenSlice';

export const store = configureStore({
  reducer: {authToken: authTokenSlice, [authApi.reducerPath]: authApi.reducer},
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(() => next => action => {
        console.debug(action);
        next(action);
      }),
});
setupListeners(store.dispatch);

store.dispatch(initializeAuthToken());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
