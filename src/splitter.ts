export interface SplitOptions {
  /**
   * Maximum number of characters per chunk.
   * ElevenLabs limits vary by model; this is a conservative default.
   */
  maxCharacters?: number;
}

const DEFAULT_MAX_CHARACTERS = 1800;

/**
 * Split text into sentence-aware chunks.
 * The returned chunks preserve order.
 */
export function splitText(
  text: string,
  options: SplitOptions = {}
): string[] {
  const maxCharacters =
    options.maxCharacters ?? DEFAULT_MAX_CHARACTERS;

  const normalized = text.trim();

  if (normalized.length <= maxCharacters) {
    return [normalized];
  }

  const sentences = splitIntoSentences(normalized);

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    // Extremely long sentence fallback
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
      continue;
    }

    chunks.push(current.trim());
    current = sentence;
  }

  if (current.length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Split using punctuation whenever possible.
 */
function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[。！？.!?])\s+/u)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Fallback splitter for very long sentences.
 */
function splitHard(
  text: string,
  maxCharacters: number
): string[] {
  const parts: string[] = [];

  let start = 0;

  while (start < text.length) {
    parts.push(
      text.slice(start, start + maxCharacters).trim()
    );

    start += maxCharacters;
  }

  return parts;
}
