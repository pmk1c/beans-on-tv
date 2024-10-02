import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";

import Token from "./Token";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.USE_AUTH_DEV_SERVER
      ? Platform.select({
          ios: "http://localhost:5173/api",
          android: "http://10.0.2.2:5173/api",
        })
      : "https://rbtv.bmind.de/api",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  endpoints: (build) => ({
    createCode: build.mutation<string, undefined>({
      query: () => ({
        method: "POST",
        url: "/code-token-exchange-create",
        body: {},
      }),
      transformResponse: (response: { code: string }) => response.code,
    }),
    getToken: build.mutation<Token | null, string>({
      query: (code) => ({
        method: "POST",
        url: "/code-token-exchange-read",
        body: { code },
      }),
      transformResponse: (response: { token: Token | null }) => response.token,
    }),
    refreshToken: build.mutation<Token, Token>({
      query: (token) => ({
        method: "POST",
        url: "/token-refresh",
        body: { token },
      }),
      transformResponse: (response: { token: Token }) => response.token,
    }),
  }),
});

export const { useCreateCodeMutation, useGetTokenMutation } = authApi;
export default authApi;
