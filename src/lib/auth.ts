import { expo } from "@better-auth/expo";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { bearer, deviceAuthorization } from "better-auth/plugins";
import { genericOAuth } from "better-auth/plugins/generic-oauth";

import prisma from "./prisma";

const DEVICE_CLIENT_ID = process.env.EXPO_PUBLIC_BETTER_AUTH_DEVICE_CLIENT_ID;

const trustedOrigins = [
  "beansontv://",
  "beansontv://*",
  process.env.EXPO_PUBLIC_BETTER_AUTH_URL!,
  ...(process.env.NODE_ENV === "development" ? ["exp://", "exp://**"] : []),
];

export const auth = betterAuth({
  appName: "Beans on TV",
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    expo(),
    bearer(),
    deviceAuthorization({
      schema: {},
      verificationUri: "/device",
      validateClient: async (clientId) => clientId === DEVICE_CLIENT_ID,
    }),
    genericOAuth({
      config: [
        {
          providerId: "rbtv",
          authorizationUrl: "https://rocketbeans.tv/oauth2/authorize",
          tokenUrl: "https://api.rocketbeans.tv/v1/oauth2/token",
          clientId: process.env.RBTV_CLIENT_ID!,
          clientSecret: process.env.RBTV_CLIENT_SECRET!,
          scopes: ["user.email.read", "user.info", "rbsc.video.token"],
          getUserInfo: async (tokens) => {
            const response = await fetch("https://api.rocketbeans.tv/v1/user/self", {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });

            const result = await response.json();

            return {
              id: result.data.id,
              name: result.data.displayName,
              email: result.data.email,
              emailVerified: !result.data.emailVerificationPending,
            };
          },
        },
      ],
    }),
  ],
});
