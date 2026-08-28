/**
 * Extracts the temporal marker at the head of an About-page log entry so the
 * component can render it in the dated gutter.
 */
export interface LogMarker {
  marker: string;
  rest: string;
}

const PATTERNS: Array<{
  pattern: RegExp;
  label: (match: RegExpMatchArray) => string;
}> = [
  {
    pattern: /^At\s+(\d{1,2})\s*[-–—]\s*(\d{1,2}),\s+/i,
    label: (match) => `Age ${match[1]}–${match[2]}`,
  },
  {
    pattern: /^(\d{1,2})\s*[-–—]\s*(\d{1,2}),\s+/,
    label: (match) => `Age ${match[1]}–${match[2]}`,
  },
  {
    pattern: /^At\s+(\d{1,2}),\s+/i,
    label: (match) => `Age ${match[1]}`,
  },
  {
    pattern: /^In\s+(\d{4}),\s+/i,
    label: (match) => match[1],
  },
];

export function extractLogMarker(text: string): LogMarker | null {
  for (const { pattern, label } of PATTERNS) {
    const match = text.match(pattern);

    if (match) {
      const rest = text.slice(match[0].length);

      if (rest.trim() === '') return null;

      return {
        marker: label(match),
        rest: rest.charAt(0).toUpperCase() + rest.slice(1),
      };
    }
  }

  return null;
}
