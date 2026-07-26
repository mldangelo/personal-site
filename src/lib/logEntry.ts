/**
 * Temporal markers at the head of a log entry.
 *
 * The history and travel lists are written as a record — "At 7, I discovered
 * …", "In 2016, I visited …" — so the marker is already in the prose. Lifting
 * it into the gutter is what turns a bulleted list into a log; inventing one
 * would not be.
 */

export interface LogMarker {
  /** Text for the gutter, e.g. "Age 7" or "2016". */
  marker: string;
  /** The entry with its leading marker removed. */
  rest: string;
}

/**
 * Ordered because the age-range pattern must be tried before the bare age.
 * Each entry maps a match to the gutter label it produces.
 */
const PATTERNS: Array<{
  pattern: RegExp;
  label: (match: RegExpMatchArray) => string;
}> = [
  // "At 14 - 17, I played a lot of video games."
  {
    pattern: /^At\s+(\d{1,2})\s*[-–—]\s*(\d{1,2}),\s+/i,
    label: (m) => `Age ${m[1]}–${m[2]}`,
  },
  // "14 - 17, I played a lot of video games."
  {
    pattern: /^(\d{1,2})\s*[-–—]\s*(\d{1,2}),\s+/,
    label: (m) => `Age ${m[1]}–${m[2]}`,
  },
  // "At 7, I discovered the mini-games hidden in Microsoft Office."
  {
    pattern: /^At\s+(\d{1,2}),\s+/i,
    label: (m) => `Age ${m[1]}`,
  },
  // "In 2016, I visited Canada, Ethiopia, Austria…"
  {
    pattern: /^In\s+(\d{4}),\s+/i,
    label: (m) => m[1],
  },
];

/**
 * Splits a leading temporal marker off a log entry.
 *
 * Returns `null` when the entry does not open with one. Those entries keep
 * their full text with an empty gutter rather than being reworded to fit the
 * pattern.
 */
export function extractLogMarker(text: string): LogMarker | null {
  for (const { pattern, label } of PATTERNS) {
    const match = text.match(pattern);

    if (match) {
      const rest = text.slice(match[0].length);

      // A marker with nothing left after it is a false positive.
      if (rest.trim() === '') {
        return null;
      }

      return {
        marker: label(match),
        // The remainder opens mid-sentence once the marker is gone.
        rest: rest.charAt(0).toUpperCase() + rest.slice(1),
      };
    }
  }

  return null;
}
