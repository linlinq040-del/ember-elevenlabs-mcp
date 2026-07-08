import pino from 'pino';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { config } from './config.js';

mkdirSync(config.LOG_DIR, { recursive: true });

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    targets: [
      {
        target: 'pino/file',
        options: {
          destination: join(config.LOG_DIR, 'app.log'),
          mkdir: true
        }
      },
      {
        target: 'pino-pretty',
        level: config.LOG_LEVEL,
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    ]
  }
});

export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}

export function logSuccess(
  requestId: string,
  characterCount: number,
  durationMs: number
) {
  logger.info({
    requestId,
    characterCount,
    durationMs
  }, 'TTS request completed');
}

export function logFailure(
  requestId: string,
  characterCount: number,
  error: unknown
) {
  logger.error({
    requestId,
    characterCount,
    error
  }, 'TTS request failed');
}
