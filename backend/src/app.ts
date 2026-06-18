import express from 'express';
import {
  apiRateLimiter,
  compressionMiddleware,
  corsMiddleware,
  errorHandler,
  notFoundHandler,
  requestLogger,
  securityMiddleware,
} from './middleware';
import routes from './routes';
import { getApiPrefix } from './utils/apiPath';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(requestLogger);
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(apiRateLimiter);

app.use(getApiPrefix(), routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
