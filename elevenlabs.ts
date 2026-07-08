import { mkdirSync, writeFile } from 'node:fs';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { config } from './config.js';
import { withRetry, RetryableError } from './retry.js';

const writeFileAsync = promisify(writeFile);

export interface SynthesizeResult {
  filename: string;
  filePath: string;
  audioUrl: string;
}

export async function synthesizeSpeech(text: string): Promise<SynthesizeResult> {
  mkdirSync(config.AUDIO_OUTPUT_DIR, { recursive: true });

  const filename = `${randomUUID()}.mp3`;
  const filePath = join(config.AUDIO_OUTPUT_DIR, filename);

  const response = await withRetry(async () => {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${config.ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": config.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text,
          model_id: config.ELEVENLABS_MODEL_ID
        })
      }
    );

    if (!res.ok) {
      throw new RetryableError(
        `ElevenLabs request failed (${res.status})`,
        res.status
      );
    }

    return res;
  });

  const audio = Buffer.from(await response.arrayBuffer());

  await writeFileAsync(filePath, audio);

  return {
    filename,
    filePath,
    audioUrl: `${config.PUBLIC_BASE_URL}/audio/${filename}`
  };
}
