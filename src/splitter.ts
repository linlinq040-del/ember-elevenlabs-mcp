export interface SplitOptions {
  /**
   * Maximum characters per chunk.
   * Conservative default for ElevenLabs.
   */
  maxCharacters?: number;
}

const DEFAULT_MAX_CHARACTERS = 1800;

/**
 * Split long text into sentence-aware chunks.
 */
export function splitText(
  text: string,
  options: SplitOptions = {}
): string[] {
  const maxCharacters =
    options.maxCharacters ?? DEFAULT_MAX_CHARACTERS;

  const normalized = text.trim();

  if (normalized.length === 0) {
    return [];
  }

  if (normalized.length <= maxCharacters) {
    return [normalized];
  }

  const sentences = splitIntoSentences(normalized);

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    // Extremely long sentence fallback.
    if (sentence.length > maxCharacters) {
      if (current.length > 0) {
        chunks.push(current.trim());
        current = "";
      }

      chunks.push(...splitHard(sentence, maxCharacters));
      continue;
    }

    const candidate =
      current.length === 0
        ? sentence
        : `${current} ${sentence}`;

    if (candidate.length <= maxCharacters) {
      current = candidate;
    } else {
      chunks.push(current.trim());
      current = sentence;
    }
  }

  if (current.length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Split text by Chinese and English sentence endings.
 */
function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[。！？.!?])\s+/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/**
 * Hard split for very long sentences.
 */
function splitHard(
  text: string,
  maxCharacters: number
): string[] {
  const result: string[] = [];

  let start = 0;

  while (start < text.length) {
    result.push(
      text
        .slice(start, start + maxCharacters)
        .trim()
    );

    start += maxCharacters;
  }

  return result;
}