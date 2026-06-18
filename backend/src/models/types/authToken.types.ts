import { Document, Types } from 'mongoose';

export const AUTH_TOKEN_TYPES = [
  'refresh',
  'reset',
  'verify',
  'verify_email',
] as const;

export type AuthTokenType = (typeof AUTH_TOKEN_TYPES)[number];

/** Keys that map to `env.jwt` in src/config/env.ts */
export type AuthTokenEnvKey = 'refresh' | 'reset' | 'verify' | 'verifyEmail';

export const AUTH_TOKEN_ENV_MAP: Record<AuthTokenType, AuthTokenEnvKey> = {
  refresh: 'refresh',
  reset: 'reset',
  verify: 'verify',
  verify_email: 'verifyEmail',
};

export interface IAuthToken {
  user: Types.ObjectId;
  tokenHash: string;
  type: AuthTokenType;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthTokenDocument extends IAuthToken, Document {
  id: string;
}
