import { NextFunction, Request, Response } from 'express';
import { log } from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    log.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}
