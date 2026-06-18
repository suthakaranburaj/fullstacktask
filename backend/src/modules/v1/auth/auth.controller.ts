import { Request, Response } from 'express';
import { asyncHandler, respond } from '../../../utils';
import * as authService from './auth.service';
import { GoogleSignInBody, LogoutBody, RefreshTokenBody } from './auth.types';

export const googleSignIn = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body as GoogleSignInBody;
  const result = await authService.googleSignIn(idToken);

  return respond.created(res, 'Signed in successfully', result);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as RefreshTokenBody;
  const tokens = await authService.refreshAccessToken(refreshToken);

  return respond.success({
    res,
    message: 'Token refreshed successfully',
    data: tokens,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as LogoutBody;
  await authService.logout(req.user!.id, refreshToken);

  return respond.success({
    res,
    message: 'Logged out successfully',
    data: null,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);

  return respond.success({
    res,
    message: 'Profile fetched successfully',
    data: user,
  });
});
