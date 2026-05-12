import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { deviceAuthorizationClient, genericOAuthClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseUrl: process.env.EXPO_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:8081",
  plugins: [
    expoClient({
      scheme: "beansontv",
      storagePrefix: "beansontv",
      storage: SecureStore,
    }),
    deviceAuthorizationClient(),
    genericOAuthClient(),
  ],
});
