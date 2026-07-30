/**
 * Temporal markers at the head of a log entry.
 *
 * The history and travel lists are written as a record — "At 7, I discovered
 * …", "In 2016, I visited …", "We subscribed to AOL in 1995" — so the marker is
 * already in the prose. Lifting it into the gutter is what turns a bulleted
 * list into a log; inventing one would not be.
 *
 * Markers repeat only what the entry actually says. A year does not establish
 * an exact age without the event date, and an age can span two calendar years,
 * so deriving either value would add precision the source does not contain.
 */

/** A plausible four-digit year; the surrounding patterns supply date context. */
const YEAR_PATTERN = /(?:1[89]|20)\d{2}/;

export interface LogMarker {
  /** Explicit age or age range, e.g. "Age 7". */
  age?: string;
  /** Explicit year or year range. */
  year?: string;
  /**
   * The entry text to render. The marker is removed only when it was a leading
   * phrase that can be dropped and still leave a sentence behind; a marker
   * embedded in the prose is annotated where it stands.
   */
  rest: string;
}

/** One value or an inclusive range of them. */
type Span = [number] | [number, number];

interface Reading {
  age?: Span;
  year?: Span;
}

/**
 * Markers that open the entry and can be lifted out of it, leaving a sentence.
 * Ordered: the range patterns must be tried before the bare age.
 */
const LEADING_PATTERNS: Array<{
  pattern: RegExp;
  read: (match: RegExpMatchArray) => Reading;
}> = [
  // "At 14 - 17, I played a lot of video games." / "14 - 17, I played …"
  {
    pattern: /^(?:At\s+)?(\d{1,2})\s*[-–—]\s*(\d{1,2}),\s+/i,
    read: (m) => ({ age: [num(m[1]), num(m[2])] }),
  },
  // "At 7, I discovered the mini-games hidden in Microsoft Office."
  {
    pattern: /^At\s+(\d{1,2}),\s+/i,
    read: (m) => ({ age: [num(m[1])] }),
  },
  // "When I was 12, I set the all-time high record at my local laser tag …"
  {
    pattern: /^When\s+I\s+was\s+(\d{1,2}),\s+/i,
    read: (m) => ({ age: [num(m[1])] }),
  },
  // "I was 11 when I built my first Tesla Coil …"
  {
    pattern: /^I\s+was\s+(\d{1,2})\s+when\s+/i,
    read: (m) => ({ age: [num(m[1])] }),
  },
  // "In 2016, I visited Canada …"
  // Qualified dates such as "In the summer of 1996" stay in the prose so the
  // qualifier is not discarded; INLINE_YEAR still annotates the entry.
  {
    pattern: new RegExp(`^In\\s+(${YEAR_PATTERN.source}),\\s+`, 'i'),
    read: (m) => ({ year: [num(m[1])] }),
  },
];

/**
 * Markers the sentence is built around, which cannot be lifted without
 * rewriting it: "…in my bedroom in 1993 when I was 3", "…to AOL in 1995".
 * Both are anchored to a preposition or to "I was" so that stray numbers such
 * as "approximately 50 countries" and model names such as "Tandy 2000" are not
 * read as dates.
 */
const INLINE_YEAR = new RegExp(
  `\\b(?:in|of|since|during|by)\\s+(${YEAR_PATTERN.source})\\b`,
  'i',
);
const INLINE_AGE =
  /\b(?:when\s+I\s+was|I\s+was|at\s+the\s+age\s+of)\s+(\d{1,2})\b/i;

function num(value: string) {
  return Number.parseInt(value, 10);
}

/**
 * The opening sentence, which is where a marker belongs. Scanning the whole
 * entry would let a year mentioned three sentences later date the entry.
 */
function openingSentence(text: string) {
  const end = text.search(/[.!?]\s/);
  return end === -1 ? text : text.slice(0, end + 1);
}

function formatSpan(span: Span) {
  return span.length === 2 ? `${span[0]}–${span[1]}` : `${span[0]}`;
}

function toMarker(reading: Reading, rest: string): LogMarker | null {
  const { age, year } = reading;

  if (!age && !year) {
    return null;
  }

  return {
    ...(age ? { age: `Age ${formatSpan(age)}` } : {}),
    ...(year ? { year: formatSpan(year) } : {}),
    rest,
  };
}

/**
 * Splits a temporal marker off a log entry, or reads one out of its prose.
 *
 * Returns `null` when the entry carries no marker at all. Those entries keep
 * their full text with an empty gutter rather than being reworded to fit the
 * pattern.
 */
export function extractLogMarker(text: string): LogMarker | null {
  for (const { pattern, read } of LEADING_PATTERNS) {
    const match = text.match(pattern);

    if (match) {
      const rest = text.slice(match[0].length);

      // A marker with nothing left after it is a false positive.
      if (rest.trim() === '') {
        return null;
      }

      // The remainder opens mid-sentence once the marker is gone.
      return toMarker(
        read(match),
        rest.charAt(0).toUpperCase() + rest.slice(1),
      );
    }
  }

  const opening = openingSentence(text);
  const year = opening.match(INLINE_YEAR);
  const age = opening.match(INLINE_AGE);

  if (!year && !age) {
    return null;
  }

  // Nothing is lifted here, so the sentence keeps every word it had.
  return toMarker(
    {
      ...(age ? { age: [num(age[1])] as Span } : {}),
      ...(year ? { year: [num(year[1])] as Span } : {}),
    },
    text,
  );
}
