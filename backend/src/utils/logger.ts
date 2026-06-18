import { env } from '../config/env';

type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const LOG_COLORS: Record<LogLevel, string> = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[36m',
  http: '\x1b[35m',
  debug: '\x1b[90m',
};

const RESET = '\x1b[0m';

const currentLevel: LogLevel = env.isProduction ? 'info' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, message: string, meta?: unknown): string {
  const timestamp = new Date().toISOString();
  const color = LOG_COLORS[level];
  const levelLabel = level.toUpperCase().padEnd(5);
  const metaText = meta ? ` ${JSON.stringify(meta)}` : '';

  return `${color}[${timestamp}] ${levelLabel}${RESET} ${message}${metaText}`;
}

function write(level: LogLevel, message: string, meta?: unknown): void {
  if (!shouldLog(level)) {
    return;
  }

  const output = formatMessage(level, message, meta);

  if (level === 'error') {
    console.error(output);
    return;
  }

  if (level === 'warn') {
    console.warn(output);
    return;
  }

  console.log(output);
}

export const log = {
  error(message: string, meta?: unknown): void {
    write('error', message, meta);
  },

  warn(message: string, meta?: unknown): void {
    write('warn', message, meta);
  },

  info(message: string, meta?: unknown): void {
    write('info', message, meta);
  },

  http(message: string, meta?: unknown): void {
    write('http', message, meta);
  },

  debug(message: string, meta?: unknown): void {
    write('debug', message, meta);
  },
};
