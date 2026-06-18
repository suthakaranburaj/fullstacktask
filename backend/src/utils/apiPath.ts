import { env } from '../config/env';

export function getApiPrefix(): string {
  return `/api/${env.apiVersion}`;
}
