type Token = {
  accessToken: string;
  validUntil: string;
  refreshToken: string;
};

export function fromOAuthToken(token: {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}) {
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
