import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { OAuth2Client } from 'google-auth-library';
import { Types } from 'mongoose';
import { env } from '../../../config/env';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../constants/httpStatus';
import { User } from '../../../models/User';
import { AuthToken } from '../../../models/AuthToken';
import {
  AccessTokenPayload,
  AuthResponse,
  RefreshTokenResponse,
} from './auth.types';

const googleClient = new OAuth2Client(env.google.clientId);

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createRefreshTokenValue(): string {
  return crypto.randomBytes(40).toString('hex');
}

function getExpiryDate(expiresIn: string): Date {
  const duration = ms(expiresIn as `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`);

  if (typeof duration !== 'number') {
    throw new AppError('Invalid token expiration configuration', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return new Date(Date.now() + duration);
}

function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwt.access.secret, {
    expiresIn: env.jwt.access.expiresIn as jwt.SignOptions['expiresIn'],
  });
}

async function saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
  await AuthToken.create({
    user: new Types.ObjectId(userId),
    tokenHash: hashToken(refreshToken),
    type: 'refresh',
    expiresAt: getExpiryDate(env.jwt.refresh.expiresIn),
    isRevoked: false,
  });
}

function formatUserResponse(user: {
  id: string;
  email: string;
  name: string;
  picture: string;
  isEmailVerified: boolean;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    isEmailVerified: user.isEmailVerified,
  };
}

export async function googleSignIn(idToken: string): Promise<AuthResponse> {
  if (!idToken?.trim()) {
    throw new AppError('Google ID token is required', HttpStatus.BAD_REQUEST);
  }

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.google.clientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError('Invalid Google ID token', HttpStatus.UNAUTHORIZED);
  }

  if (!payload?.sub || !payload.email) {
    throw new AppError('Google account details are incomplete', HttpStatus.BAD_REQUEST);
  }

  const user = await User.findOneAndUpdate(
    { googleId: payload.sub },
    {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? '',
      picture: payload.picture ?? '',
      isEmailVerified: payload.email_verified ?? false,
      emailVerifiedAt: payload.email_verified ? new Date() : null,
      lastLoginAt: new Date(),
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', HttpStatus.FORBIDDEN);
  }

  const refreshToken = createRefreshTokenValue();
  await saveRefreshToken(user.id, refreshToken);

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: formatUserResponse(user),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  if (!refreshToken?.trim()) {
    throw new AppError('Refresh token is required', HttpStatus.BAD_REQUEST);
  }

  const storedToken = await AuthToken.findOne({
    tokenHash: hashToken(refreshToken),
    type: 'refresh',
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).select('+tokenHash');

  if (!storedToken) {
    throw new AppError('Invalid or expired refresh token', HttpStatus.UNAUTHORIZED);
  }

  const user = await User.findById(storedToken.user);

  if (!user || !user.isActive) {
    throw new AppError('User account not found or inactive', HttpStatus.UNAUTHORIZED);
  }

  storedToken.isRevoked = true;
  await storedToken.save();

  const newRefreshToken = createRefreshTokenValue();
  await saveRefreshToken(user.id, newRefreshToken);

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(userId: string, refreshToken: string): Promise<void> {
  if (!refreshToken?.trim()) {
    throw new AppError('Refresh token is required', HttpStatus.BAD_REQUEST);
  }

  await AuthToken.updateOne(
    {
      user: new Types.ObjectId(userId),
      tokenHash: hashToken(refreshToken),
      type: 'refresh',
      isRevoked: false,
    },
    { isRevoked: true }
  );
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', HttpStatus.NOT_FOUND);
  }

  return formatUserResponse(user);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, env.jwt.access.secret) as AccessTokenPayload;
  } catch {
    throw new AppError('Invalid or expired access token', HttpStatus.UNAUTHORIZED);
  }
}
