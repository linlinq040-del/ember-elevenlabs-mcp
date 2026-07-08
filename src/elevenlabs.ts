import { mkdir } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

import { config } from "./config.js";
import {
  RetryableError,
  withRetry
} from "./retry.js";

export interface AudioResult {
  filename: string;
  filePath: string;
  audioUrl: string;
}

export class ElevenLabsClient {
  async synthesize(
    text: string
  ): Promise<AudioResult> {

    await mkdir(
      config.AUDIO_OUTPUT_DIR,
      {
        recursive: true
      }
    );

    const filename =
      `${randomUUID()}.mp3`;

    const filePath = join(
      config.AUDIO_OUTPUT_DIR,
      filename
    );

    const response = await withRetry(
      async () => {

        const controller =
          new AbortController();

        const timeout =
          setTimeout(
            () => controller.abort(),
            config.REQUEST_TIMEOUT_MS
          );

        try {

          const res = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${config.ELEVENLABS_VOICE_ID}`,
            {
              method: "POST",

              signal: controller.signal,

              headers: {
                "xi-api-key":
                  config.ELEVENLABS_API_KEY,

                "Content-Type":
                  "application/json",

                Accept:
                  "audio/mpeg"
              },

              body: JSON.stringify({
                text,
                model_id:
                  config.ELEVENLABS_MODEL_ID
              })
            }
          );

          if (!res.ok) {
            throw new RetryableError(
              `ElevenLabs API returned ${res.status}`,
              res.status
            );
          }

          return res;

        } finally {

          clearTimeout(timeout);

        }
      }
    );

    const audio = Buffer.from(
      await response.arrayBuffer()
    );

    await writeFile(
      filePath,
      audio
    );

    return {
      filename,
      filePath,
      audioUrl:
        `${config.PUBLIC_BASE_URL}/audio/${filename}`
    };
  }
}

export const elevenLabs =
  new ElevenLabsClient();