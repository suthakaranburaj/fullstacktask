import mongoose from 'mongoose';
import { env } from './env';
import { log } from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongodbUri);
    log.info('MongoDB connected successfully');
  } catch (error) {
    log.error('MongoDB connection failed', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  log.info('MongoDB disconnected');
}
