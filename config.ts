import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  PUBLIC_BASE_URL: z.string().url(),

  ELEVENLABS_API_KEY: z.string().min(1),
  ELEVENLABS_VOICE_ID: z.string().min(1),
  ELEVENLABS_MODEL_ID: z.string().default('eleven_v3'),

  AUTO_REMOVE_MARKDOWN: z.coerce.boolean().default(true),
  AUTO_REMOVE_EMOJI: z.coerce.boolean().default(true),
  AUTO_SPLIT_TEXT: z.coerce.boolean().default(true),

  AUTO_RETRY: z.coerce.boolean().default(true),
  REQUEST_TIMEOUT_MS: z.coerce.number().default(10000),
  MAX_RETRY_COUNT: z.coerce.number().default(3),
  CIRCUIT_BREAKER_FAILURE_THRESHOLD: z.coerce.number().default(10),
  CIRCUIT_BREAKER_RESET_SECONDS: z.coerce.number().default(30),

  AUDIO_OUTPUT_DIR: z.string().default('public/audio'),
  AUTO_CLEANUP_DAYS: z.coerce.number().default(7),

  LOG_LEVEL: z.enum(['trace','debug','info','warn','error','fatal']).default('info'),
  LOG_DIR: z.string().default('logs')
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration');
  console.error(parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;

export type AppConfig = typeof config;
