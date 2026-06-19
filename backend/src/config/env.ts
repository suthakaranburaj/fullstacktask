import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
  isDevelopment: (process.env.NODE_ENV ?? 'development') === 'development',
  port: Number(process.env.PORT ?? 3000),
  apiVersion: process.env.API_VERSION ?? 'v1',
  baseUrl: requireEnv('BASE_URL'),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3001',
  shareLinkBaseUrl: (
    process.env.SHARE_LINK_BASE_URL ??
    process.env.FRONTEND_URL ??
    'http://localhost:3001'
  ).replace(/\/$/, ''),
  mongodbUri: requireEnv('MONGODB_URI'),
  cors: {
    origins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:3001')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100),
  },
  google: {
    clientId: requireEnv('GOOGLE_CLIENT_ID'),
    clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
  },
  jwt: {
    access: {
      secret: requireEnv('JWT_SECRET'),
      expiresIn: requireEnv('JWT_EXPIRATION'),
    },
    refresh: {
      secret: requireEnv('JWT_REFRESH_SECRET'),
      expiresIn: requireEnv('JWT_REFRESH_EXPIRATION'),
    },
    reset: {
      secret: requireEnv('JWT_RESET_SECRET'),
      expiresIn: requireEnv('JWT_RESET_EXPIRATION'),
    },
    verify: {
      secret: requireEnv('JWT_VERIFY_SECRET'),
      expiresIn: requireEnv('JWT_VERIFY_EXPIRATION'),
    },
    verifyEmail: {
      secret: requireEnv('JWT_VERIFY_EMAIL_SECRET'),
      expiresIn: requireEnv('JWT_VERIFY_EMAIL_EXPIRATION'),
    },
  },
} as const;

export type AuthTokenEnvKey = keyof typeof env.jwt;
