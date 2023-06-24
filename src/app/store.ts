import {configureStore} from '@reduxjs/toolkit';
import authApi from '../features/auth/authApi';
import {setupListeners} from '@reduxjs/toolkit/dist/query';

export const store = configureStore({
  reducer: {[authApi.reducerPath]: authApi.reducer},
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(() => next => action => {
        console.debug(action);
        next(action);
      }),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
