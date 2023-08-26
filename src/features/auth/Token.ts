type Token = {
  accessToken: string;
  validUntil: string;
  refreshToken: string;
};

function isToken(token: unknown): token is Token {
  return (
    typeof token === 'object' &&
    token !== null &&
    'accessToken' in token &&
    'validUntil' in token &&
    'refreshToken' in token &&
    typeof token.accessToken === 'string' &&
    typeof token.validUntil === 'string' &&
    typeof token.refreshToken === 'string'
  );
}

export function fromJSON(json: string) {
  const token = JSON.parse(json);
  if (!isToken(token)) {
    throw new Error('Invalid token: ' + JSON.stringify(token));
  }

  return token;
}

export function isValid(token: Token) {
  return new Date(token.validUntil) > new Date();
}

export default Token;
