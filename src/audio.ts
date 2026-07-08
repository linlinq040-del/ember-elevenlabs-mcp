import { access, rm } from "node:fs/promises";
import { constants } from "node:fs";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { spawn } from "node:child_process";

import { config } from "./config.js";

export interface MergeResult {
  filename: string;
  filePath: string;
  audioUrl: string;
}

/**
 * Merge multiple MP3 files into one output file using ffmpeg.
 *
 * ffmpeg must be available on the host system (or bundled later with
 * ffmpeg-static in a future revision).
 */
export async function mergeAudio(
  inputFiles: string[]
): Promise<MergeResult> {
  if (inputFiles.length === 0) {
    throw new Error("No audio files to merge.");
  }

  if (inputFiles.length === 1) {
    const filePath = inputFiles[0];
    const filename = filePath.split(/[\\/]/).pop()!;

    return {
      filename,
      filePath,
      audioUrl: `${config.PUBLIC_BASE_URL}/audio/${filename}`
    };
  }

  const listFile = join(
    config.AUDIO_OUTPUT_DIR,
    `${randomUUID()}.txt`
  );

  const outputName = `${randomUUID()}.mp3`;
  const outputPath = join(config.AUDIO_OUTPUT_DIR, outputName);

  const { writeFile } = await import("node:fs/promises");

  await writeFile(
    listFile,
    inputFiles.map(f => `file '${f}'`).join("\n"),
    "utf8"
  );

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

    ffmpeg.on("close", code => {
      code === 0
        ? resolve()
        : reject(new Error(`ffmpeg exited with ${code}`));
    });
  });

  await rm(listFile, { force: true });

  for (const file of inputFiles) {
    try {
      await access(file, constants.F_OK);
      await rm(file, { force: true });
    } catch {
      // ignore cleanup failures
    }
  }

  return {
    filename: outputName,
    filePath: outputPath,
    audioUrl: `${config.PUBLIC_BASE_URL}/audio/${outputName}`
  };
}
