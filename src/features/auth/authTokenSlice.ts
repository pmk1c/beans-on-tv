import Token, { isValid } from "./Token";
import * as TokenStorage from "./TokenStorage";
import authApi from "./authApi";
import { selectSocket } from "../../core/rbtvApi/rbtvSocketApiSlice";
import { createSliceWithThunks } from "../../core/redux/createSliceWithThunks";
import { RootState } from "../../core/redux/store";

export const authTokenSlice = createSliceWithThunks({
  name: "authToken",
  initialState: {
    initialized: false,
    token: undefined as Token | undefined,
  },
  reducers: (create) => ({
    initializeAuthToken: create.asyncThunk<Token | undefined>(
      async (arg, { dispatch, getState }) => {
        let token = await TokenStorage.getToken();
        if (!token || (!isValid(token) && !token.refreshToken)) {
          return;
        }

        if (!isValid(token)) {
          token = await dispatch(
            authApi.endpoints.refreshToken.initiate(token)
          ).unwrap();
        }

        // TODO move this into its own slice, since it does not belong here
        const socket = selectSocket(getState() as RootState);
        socket.emitAuthentication(token.accessToken);
        socket.on("AC_AUTHENTICATION_RESULT", () => null);
        socket.on("AC_AUTHENTICATION_REQ", () => {
          if (!token) {
            return;
          }

          socket.emitAuthentication(token.accessToken);
        });

        return token;
      },
      {
        rejected: (state) => {
          state.token = undefined;
        },
        fulfilled: (state, action) => {
          state.token = action.payload;
        },
        settled: (state) => {
          state.initialized = true;
        },
      }
    ),
    setAuthToken: create.asyncThunk(
      async (token: Token, { getState }) => {
        await TokenStorage.setToken(token);

        // TODO move this into its own slice, since it does not belong here
        const socket = selectSocket(getState() as RootState);
        socket.emitAuthentication(token.accessToken);
      },
      {
        pending: (state, action) => {
          state.token = action.meta.arg;
        },
        rejected: (state) => {
          state.token = undefined;
        },
      }
    ),
    resetAuthToken: create.asyncThunk(
      async () => {
        await TokenStorage.resetToken();
      },
      {
        pending: (state) => {
          state.token = undefined;
        },
      }
    ),
  }),
  selectors: {
    selectAuthToken: (state) => state.token,
    selectAuthTokenInitialized: (state) => state.initialized,
  },
});

export const { initializeAuthToken, setAuthToken, resetAuthToken } =
  authTokenSlice.actions;
export const { selectAuthToken, selectAuthTokenInitialized } =
  authTokenSlice.selectors;
