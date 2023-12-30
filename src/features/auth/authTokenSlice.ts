import * as TokenStorage from './TokenStorage';
import Token, {isValid} from './Token';
import authApi from './authApi';
import {createSliceWithThunks} from '../../app/redux/createSliceWithThunks';

export const authTokenSlice = createSliceWithThunks({
  name: 'authToken',
  initialState: {
    initialized: false,
    token: undefined as Token | undefined,
  },
  reducers: create => ({
    initializeAuthToken: create.asyncThunk<undefined, Token | undefined>(
      async (_, {dispatch}) => {
        const token = await TokenStorage.getToken();
        if (!token || (!isValid(token) && !token.refreshToken)) {
          return;
        }

        if (!isValid(token)) {
          return await dispatch(
            authApi.endpoints.refreshToken.initiate(token),
          ).unwrap();
        }

        return token;
      },
      {
        rejected: state => {
          state.token = undefined;
        },
        fulfilled: (state, action) => {
          state.token = action.payload;
        },
        settled: state => {
          state.initialized = true;
        },
      },
    ),
    setAuthToken: create.asyncThunk(
      async (token: Token) => {
        await TokenStorage.setToken(token);
      },
      {
        pending: (state, action) => {
          state.token = action.meta.arg;
        },
        rejected: state => {
          state.token = undefined;
        },
      },
    ),
    resetAuthToken: create.asyncThunk<undefined>(
      async () => {
        await TokenStorage.resetToken();
      },
      {
        pending: state => {
          state.token = undefined;
        },
      },
    ),
  }),
  selectors: {
    selectAuthToken: state => state.token,
    selectAuthTokenInitialized: state => state.initialized,
  },
});

export const {initializeAuthToken, setAuthToken, resetAuthToken} =
  authTokenSlice.actions;
export const {selectAuthToken, selectAuthTokenInitialized} =
  authTokenSlice.selectors;
