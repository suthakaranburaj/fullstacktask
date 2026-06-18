import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../constants/httpStatus';
import { verifyAccessToken } from './auth.service';

export function protect(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError('Please log in to continue', HttpStatus.UNAUTHORIZED));
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    next(new AppError('Please log in to continue', HttpStatus.UNAUTHORIZED));
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    next(error);
  }
}
