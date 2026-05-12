import Token from "./Token";
import { authClient } from "@/src/lib/auth-client";

const DEFAULT_EXPIRATION_MS = 60 * 60 * 1000;

function toIso(value: Date | string | undefined) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return new Date(Date.now() + DEFAULT_EXPIRATION_MS).toISOString();
}

function toToken(payload: { accessToken: string; accessTokenExpiresAt?: Date | string }): Token {
  return {
    accessToken: payload.accessToken,
    validUntil: toIso(payload.accessTokenExpiresAt),
    refreshToken: null,
    appReview: false,
  };
}

export async function getRbtvToken(
  options: {
    authorization?: string;
  } = {},
) {
  const { data, error } = await authClient.getAccessToken({
    providerId: "rbtv",
    fetchOptions: {
      headers: options.authorization ? { authorization: options.authorization } : undefined,
    },
  });

  if (error || !data?.accessToken) {
    return null;
  }

  return toToken({
    accessToken: data.accessToken,
    accessTokenExpiresAt: data.accessTokenExpiresAt,
  });
}
