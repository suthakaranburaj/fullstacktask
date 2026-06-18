export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  isEmailVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface GoogleSignInPayload {
  idToken: string;
}
