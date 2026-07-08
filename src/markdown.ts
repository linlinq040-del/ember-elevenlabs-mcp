export interface CleanTextOptions {
  removeMarkdown?: boolean;
  removeEmoji?: boolean;
}

const MARKDOWN_PATTERNS: Array<[RegExp, string]> = [
  [/```[\s\S]*?```/g, ""],
  [/`([^`]*)`/g, "$1"],
  [/\*\*(.*?)\*\*/g, "$1"],
  [/\*(.*?)\*/g, "$1"],
  [/__(.*?)__/g, "$1"],
  [/_(.*?)_/g, "$1"],
  [/~~(.*?)~~/g, "$1"],
  [/^#{1,6}\s+/gm, ""],
  [/^\>\s?/gm, ""],
  [/^\s*[-*+]\s+/gm, ""],
  [/^\s*\d+\.\s+/gm, ""],
  [/$begin:math:display$\(\[\^$end:math:display$]+)\]$begin:math:text$\[\^\)\]\+$end:math:text$/g, "$1"]
];

const EMOJI_REGEX =
  /[\p{Extended_Pictographic}\u2600-\u27BF]/gu;

export function cleanText(
  input: string,
  options: CleanTextOptions = {}
): string {
  const {
    removeMarkdown = true,
    removeEmoji = true
  } = options;

  let text = input;

  if (removeMarkdown) {
    for (const [pattern, replacement] of MARKDOWN_PATTERNS) {
      text = text.replace(pattern, replacement);
    }
  }

  if (removeEmoji) {
    text = text.replace(EMOJI_REGEX, "");
  }

  return normalizeWhitespace(text).trim();
}

export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ ]+\n/g, "\n");
}

export function characterCount(text: string): number {
  return [...text].length;
}