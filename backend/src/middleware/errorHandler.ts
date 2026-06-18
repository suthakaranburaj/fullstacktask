import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../constants/httpStatus';
import { env } from '../config/env';
import { log } from '../utils/logger';
import { sendError } from '../utils/sendResponse';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, HttpStatus.NOT_FOUND));
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    sendError({
      res,
      statusCode: error.statusCode,
      message: error.message,
      errors: error.details,
    });
    return;
  }

  if (error.name === 'ValidationError') {
    sendError({
      res,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: error.message,
    });
    return;
  }

  if (error.name === 'CastError') {
    sendError({
      res,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid resource identifier',
    });
    return;
  }

  if ('code' in error && error.code === 11000) {
    sendError({
      res,
      statusCode: HttpStatus.CONFLICT,
      message: 'Duplicate value already exists',
    });
    return;
  }

  if (error.message?.includes('CORS')) {
    sendError({
      res,
      statusCode: HttpStatus.FORBIDDEN,
      message: error.message,
    });
    return;
  }

  log.error(error.message, { stack: error.stack });

  sendError({
    res,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: env.isProduction
      ? 'Something went wrong on our end'
      : error.message,
    errors: env.isProduction ? undefined : { stack: error.stack },
  });
}
