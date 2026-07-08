import { access, rm, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { basename, join } from "node:path";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";

import { config } from "./config.js";

export interface MergeResult {
  filename: string;
  filePath: string;
  audioUrl: string;
}

export async function mergeAudio(
  files: string[]
): Promise<MergeResult> {
  if (files.length === 0) {
    throw new Error("No audio files.");
  }

  if (files.length === 1) {
    const filePath = files.at(0);

    if (!filePath) {
      throw new Error("Missing audio file.");
    }

    return {
      filename: basename(filePath),
      filePath,
      audioUrl: `${config.PUBLIC_BASE_URL}/audio/${basename(filePath)}`
    };
  }

  const listFile = join(
    config.AUDIO_OUTPUT_DIR,
    `${randomUUID()}.txt`
  );

  const outputName = `${randomUUID()}.mp3`;

  const outputPath = join(
    config.AUDIO_OUTPUT_DIR,
    outputName
  );

  const content = files
    .map((file) => `file '${file.replace(/'/g, "'\\''")}'`)
    .join("\n");

  await writeFile(listFile, content, "utf8");

  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listFile,
      "-c",
      "copy",
      outputPath,
      "-y"
    ]);

    ffmpeg.on("error", reject);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `ffmpeg exited with code ${code}`
          )
        );
      }
    });
  });

  await rm(listFile, {
    force: true
  });

  for (const file of files) {
    try {
      await access(file, constants.F_OK);
      await rm(file, {
        force: true
      });
    } catch {
      // ignore
    }
  }

  return {
    filename: outputName,
    filePath: outputPath,
    audioUrl: `${config.PUBLIC_BASE_URL}/audio/${outputName}`
  };
}