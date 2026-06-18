import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';
import { log } from './utils/logger';
import { getApiPrefix } from './utils/apiPath';

async function startServer(): Promise<void> {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    log.info(`Server started at ${env.baseUrl}${getApiPrefix()}`);
    log.info(`Environment: ${env.nodeEnv}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    log.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      await disconnectDatabase();
      log.info('Server stopped');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
}

startServer().catch((error: Error) => {
  log.error('Failed to start server', { message: error.message, stack: error.stack });
  process.exit(1);
});
