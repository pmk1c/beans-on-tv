type Token = {
  accessToken: string;
  validUntil: string;
  refreshToken: string | null;
  appReview: boolean;
};

function isToken(token: unknown): token is Token {
  return (
    typeof token === 'object' &&
    token !== null &&
    'accessToken' in token &&
    typeof token.accessToken === 'string' &&
    'validUntil' in token &&
    typeof token.validUntil === 'string' &&
    'refreshToken' in token &&
    (typeof token.refreshToken === 'string' || token.refreshToken === null) &&
    'appReview' in token &&
    typeof token.appReview === 'boolean'
  );
}

export function fromJSON(json: string) {
  const token: unknown = {
    appReview: false,
    ...JSON.parse(json),
  };
  if (!isToken(token)) {
    throw new Error('Invalid token: ' + JSON.stringify(token));
  }

  return token;
}

export function isValid(token: Token) {
  return new Date(token.validUntil) > new Date();
}

export default Token;
