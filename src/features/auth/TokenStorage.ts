import * as SecureStore from 'expo-secure-store';

import Token, {fromJSON} from './Token';

const key = 'token-1';

export async function setToken(token: Token) {
  await SecureStore.setItemAsync(key, JSON.stringify(token));
}

export async function getToken() {
  const result = await SecureStore.getItemAsync(key);

  return result ? fromJSON(result) : null;
}

export async function resetToken() {
  await SecureStore.deleteItemAsync(key);
}
