const MARKDOWN_PATTERNS: RegExp[] = [
  /```[\s\S]*?```/g,
  /`([^`]+)`/g,
  /\*\*(.*?)\*\*/g,
  /\*(.*?)\*/g,
  /__(.*?)__/g,
  /_(.*?)_/g,
  /~~(.*?)~~/g,
  /^#{1,6}\s+/gm,
  /^\>\s?/gm,
  /^\s*[-*+]\s+/gm,
  /^\s*\d+\.\s+/gm,
  /\[([^\]]+)\]\(([^)]+)\)/g
];

const EMOJI_REGEX =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

export interface CleanTextOptions {
  removeMarkdown?: boolean;
  removeEmoji?: boolean;
}

export function cleanText(
  input: string,
  options: CleanTextOptions = {}
): string {
  let text = input;

  if (options.removeMarkdown ?? true) {
    for (const pattern of MARKDOWN_PATTERNS) {
      text = text.replace(pattern, "$1");
    }
  }

  if (options.removeEmoji ?? true) {
    text = text.replace(EMOJI_REGEX, "");
  }

  text = normalizeWhitespace(text);

  return text.trim();
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
