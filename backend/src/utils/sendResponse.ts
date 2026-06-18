import { Response } from 'express';
import { HttpStatus, HttpStatusCode } from '../constants/httpStatus';

export interface ApiSuccessBody<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: unknown;
}

interface SendSuccessOptions<T> {
  res: Response;
  statusCode?: HttpStatusCode;
  message?: string;
  data?: T;
}

interface SendErrorOptions {
  res: Response;
  statusCode?: HttpStatusCode;
  message: string;
  errors?: unknown;
}

export function sendSuccess<T>({
  res,
  statusCode = HttpStatus.OK,
  message = 'Request completed successfully',
  data = null as T,
}: SendSuccessOptions<T>): Response<ApiSuccessBody<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError({
  res,
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  message,
  errors,
}: SendErrorOptions): Response<ApiErrorBody> {
  const body: ApiErrorBody = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
}

/** Shorthand helpers for common response patterns */
export const respond = {
  success: sendSuccess,
  error: sendError,

  created<T>(res: Response, message: string, data: T) {
    return sendSuccess({ res, statusCode: HttpStatus.CREATED, message, data });
  },

  noContent(res: Response) {
    return res.status(HttpStatus.NO_CONTENT).send();
  },
};
