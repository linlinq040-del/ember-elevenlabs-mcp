import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { config } from './config.js';
import { logger, logFailure, logSuccess } from './logger.js';
import { cleanText, characterCount } from './markdown.js';
import { splitText } from './splitter.js';
import { synthesizeSpeech } from './elevenlabs.js';
import { startCleanupScheduler } from './cleanup.js';

const app = Fastify({
  logger: false
});

await app.register(fastifyStatic, {
  root: join(process.cwd(), config.AUDIO_OUTPUT_DIR),
  prefix: '/audio/'
});

app.get('/health', async () => ({
  status: 'ok'
}));

app.post('/mcp', async (request, reply) => {
  const body = request.body as { text?: string };

  if (!body?.text) {
    return reply.code(400).send({
      success: false,
      error: 'Missing "text".'
    });
  }

  const requestId = randomUUID();
  const started = Date.now();

  try {
    const cleaned = cleanText(body.text, {
      removeMarkdown: config.AUTO_REMOVE_MARKDOWN,
      removeEmoji: config.AUTO_REMOVE_EMOJI
    });

    const chunks = config.AUTO_SPLIT_TEXT
      ? splitText(cleaned)
      : [cleaned];

    // v1.0: currently synthesizes the first chunk only.
    // Future version will merge multiple MP3 files.
    const result = await synthesizeSpeech(chunks[0]);

    logSuccess(
      requestId,
      characterCount(cleaned),
      Date.now() - started
    );

    return {
      success: true,
      audio_url: result.audioUrl,
      duration: null
    };
  } catch (error) {
    logFailure(
      requestId,
      characterCount(body.text),
      error
    );

    return reply.code(500).send({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

startCleanupScheduler();

app.listen({
  port: config.PORT,
  host: '0.0.0.0'
}).then(() => {
  logger.info(
    `Ember ElevenLabs MCP listening on :${config.PORT}`
  );
});
