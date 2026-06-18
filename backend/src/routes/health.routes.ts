import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler, respond } from '../utils';
import { env } from '../config/env';

const healthRouter = Router();

healthRouter.get(
  '/health',
  asyncHandler(async (_req: Request, res: Response) => {
    const databaseState = mongoose.connection.readyState;
    const isDatabaseConnected = databaseState === 1;

    return respond.success({
      res,
      message: 'Server is healthy',
      data: {
        status: 'ok',
        environment: env.nodeEnv,
        apiVersion: env.apiVersion,
        database: isDatabaseConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export default healthRouter;
