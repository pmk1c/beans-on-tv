import * as SecureStore from "expo-secure-store";

import Token, { fromJSON } from "./Token";

const key = "api.rocketbeans.tv.token-v3";

export async function setToken(token: Token) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(token));
  } else {
    await SecureStore.setItemAsync(key, JSON.stringify(token));
  }
}

export async function getToken() {
  let result;
  if (typeof window !== "undefined") {
    result = window.localStorage.getItem(key);
  } else {
    result = await SecureStore.getItemAsync(key);
  }

  return result ? fromJSON(result) : null;
}

export async function resetToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}
