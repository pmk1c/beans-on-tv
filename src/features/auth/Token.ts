type Token = {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token: string;
  displayName: string;
  userId: number;
};

export default Token;
