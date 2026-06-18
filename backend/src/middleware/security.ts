import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from '../config/env';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || env.cors.origins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export const securityMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

export const compressionMiddleware = compression();
