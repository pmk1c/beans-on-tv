import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import * as TokenStorage from './TokenStorage';
import {RootState} from '../../app/store';
import Token from './Token';

const authTokenSlice = createSlice({
  name: 'authToken',
  initialState: {
    initialized: false,
    token: undefined as Token | undefined,
  },
  reducers: {
    setAuthToken(state, action: PayloadAction<Token>) {
      const token = action.payload;
      return {
        initialized: true,
        token,
      };
    },
    resetAuthToken() {
      return {
        initialized: true,
        token: undefined,
      };
    },
  },
});

export const initializeAuthToken = createAsyncThunk(
  'authToken/initializeAuthToken',
  async (_, {dispatch}) => {
    const token = await TokenStorage.getToken();
    if (token) {
      dispatch(authTokenSlice.actions.setAuthToken(token));
    } else {
      dispatch(authTokenSlice.actions.resetAuthToken());
    }
  },
);

export const setAuthToken = createAsyncThunk(
  'authToken/setAuthToken',
  async (token: Token, {dispatch}) => {
    await TokenStorage.setToken(token);
    dispatch(authTokenSlice.actions.setAuthToken(token));
  },
);

export const resetAuthToken = createAsyncThunk(
  'authToken/resetAuthToken',
  async (_, {dispatch}) => {
    await TokenStorage.resetToken();
    dispatch(authTokenSlice.actions.resetAuthToken());
  },
);

export const selectAuthToken = (state: RootState) => state.authToken.token;
export const selectAuthTokenInitialized = (state: RootState) =>
  state.authToken.initialized;

export default authTokenSlice.reducer;
