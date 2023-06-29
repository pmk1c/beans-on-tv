import * as Keychain from 'react-native-keychain';
import Token from './Token';

const username = 'unknown';
const service = 'api.rocketbeans.tv/v1';

export async function setToken(token: Token) {
  const result = await Keychain.setGenericPassword(
    username,
    JSON.stringify(token),
    {
      service,
    },
  );

  if (!result) {
    throw new Error('Failed to store token');
  }
}

export async function getToken() {
  const result = await Keychain.getGenericPassword({service});

  return result ? JSON.parse(result.password) : null;
}

export async function resetToken() {
  const result = await Keychain.resetGenericPassword({service});

  if (!result) {
    throw new Error('Failed to reset token');
  }
}
