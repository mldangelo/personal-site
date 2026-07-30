/**
 * Temporal markers at the head of a log entry.
 *
 * The history and travel lists are written as a record — "At 7, I discovered
 * …", "In 2016, I visited …", "We subscribed to AOL in 1995" — so the marker is
 * already in the prose. Lifting it into the gutter is what turns a bulleted
 * list into a log; inventing one would not be.
 *
 * The prose places entries two different ways, by age and by year, and a gutter
 * that printed whichever one the sentence happened to use was two timelines in
 * one column. So the year is the single axis every entry is filed under, and
 * the age rides along as the secondary line where the prose thinks in ages.
 * Both are read off `profile.birthDate`, which means the log starts at 1993 —
 * the year `profile.computingSince` already claims.
 */

import profile from '@/data/profile.json';

/**
 * Birth year as written, not as converted: an offset can push the UTC instant
 * into an adjacent calendar year, and the year someone was born is a calendar
 * fact rather than an instant. `src/lib/telemetry.ts` reads the same field for
 * the instant it needs.
 */
const BIRTH_YEAR = Number.parseInt(profile.birthDate.slice(0, 4), 10);

/** A four-digit year, tight enough that a model number is not one. */
const YEAR_PATTERN = /(?:1[89]|20)\d{2}/;

export interface LogMarker {
  /** Primary gutter line: the year, or year range, the entry is filed under. */
  year: string;
  /**
   * Secondary gutter line, e.g. "Age 7". Absent when no age can be told —
   * a year before the birth year has none.
   */
  age?: string;
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
  // "In 2016, I visited Canada …" / "In the summer of 1996, my uncle purchased …"
  {
    pattern: new RegExp(
      `^In\\s+(?:the\\s+\\w+\\s+of\\s+)?(${YEAR_PATTERN.source}),\\s+`,
      'i',
    ),
    read: (m) => ({ year: [num(m[1])] }),
  },
];

/**
 * Markers the sentence is built around, which cannot be lifted without
 * rewriting it: "…in my bedroom in 1993 when I was 3", "…to AOL in 1995".
 *
 * Both are anchored so a stray number is not read as a date, and the two
 * anchors stop different numbers, so each needs its own example.
 * `INLINE_YEAR` wants a preposition in front of the year, which is what keeps
 * a model number out of the gutter: unanchored, "an old Tandy 2000" files the
 * entry under 2000. Its word boundaries carry the near misses — "a Garmin
 * 2000" would match on the "in" ending "Garmin", "a box of 1990s" on a decade
 * — and `YEAR_PATTERN`'s 18xx/19xx/20xx shape is the only thing rejecting "a
 * floppy of 1440 KB", which is already a preposition in front of four digits.
 * `INLINE_AGE` wants "I was" or "at the age of" in front of the number, which
 * is what keeps a count out of it: unanchored, "approximately 50 countries"
 * reads as Age 50 and dates the entry to 2040.
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

/**
 * Age and year are the same fact told two ways, so either can be derived from
 * the other. The birthday falls in early February, so for all but the first
 * five weeks of a year the age is simply the year minus the birth year; the
 * gutter is an 11px annotation, and that is the precision it is asking for.
 */
function withDerivedValues({ age, year }: Reading): Reading {
  return {
    age: age ?? (year ? shift(year, -BIRTH_YEAR) : undefined),
    year: year ?? (age ? shift(age, BIRTH_YEAR) : undefined),
  };
}

function shift(span: Span, by: number): Span {
  return span.length === 2 ? [span[0] + by, span[1] + by] : [span[0] + by];
}

function formatSpan(span: Span) {
  return span.length === 2 ? `${span[0]}–${span[1]}` : `${span[0]}`;
}

function toMarker(reading: Reading, rest: string): LogMarker | null {
  const { age, year } = withDerivedValues(reading);

  if (!year) {
    return null;
  }

  return {
    year: formatSpan(year),
    // An age is only a fact once the subject exists.
    ...(age && age.every((value) => value >= 0)
      ? { age: `Age ${formatSpan(age)}` }
      : {}),
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
