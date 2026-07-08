import { mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import { config } from './config.js';
import { logger } from './logger.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function cleanupOldAudio(): void {
  mkdirSync(config.AUDIO_OUTPUT_DIR, { recursive: true });

  const now = Date.now();
  const maxAge =
    config.AUTO_CLEANUP_DAYS * ONE_DAY_MS;

  const files = readdirSync(config.AUDIO_OUTPUT_DIR);

  let removed = 0;

  for (const file of files) {
    const fullPath = join(config.AUDIO_OUTPUT_DIR, file);

    try {
      const stat = statSync(fullPath);

      if (!stat.isFile()) {
        continue;
      }

      const age = now - stat.mtimeMs;

      if (age >= maxAge) {
        unlinkSync(fullPath);
        removed++;
      }
    } catch (error) {
      logger.warn(
        {
          file: fullPath,
          error
        },
        'Failed to inspect audio file'
      );
    }
  }

  if (removed > 0) {
    logger.info(
      {
        removed
      },
      'Expired audio files removed'
    );
  }
}

export function startCleanupScheduler(): NodeJS.Timeout {
  cleanupOldAudio();

  return setInterval(
    cleanupOldAudio,
    ONE_DAY_MS
  );
}
