import {OAuthToken} from './authApi';

type Token = {
  accessToken: string;
  validUntil: string;
  refreshToken: string;
};

function isToken(token: unknown): token is Token {
  return (
    typeof token === 'object' &&
    token !== null &&
    typeof (token as Token).accessToken === 'string' &&
    typeof (token as Token).validUntil === 'string' &&
    typeof (token as Token).refreshToken === 'string'
  );
}

export function fromJSON(json: string) {
  const token = JSON.parse(json) as unknown;
  if (!isToken(token)) {
    throw new Error('Invalid token');
  }

  return token;
}

export function fromOAuthToken(token: OAuthToken) {
  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    validUntil: new Date(Date.now() + token.expires_in * 1000).toISOString(),
  };
}

export function isValid(token: Token) {
  return new Date(token.validUntil) > new Date();
}

export default Token;
