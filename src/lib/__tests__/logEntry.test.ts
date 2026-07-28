import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import profile from '@/data/profile.json';
import { extractLogMarker } from '../logEntry';

const BIRTH_YEAR = Number.parseInt(profile.birthDate.slice(0, 4), 10);

/** Bullets of one about-page section, as authored. */
function sectionEntries(title: string) {
  const body = aboutMarkdown.split(`# ${title}\n`)[1]?.split('\n# ')[0] ?? '';

  return body
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2));
}

describe('extractLogMarker', () => {
  it('files a leading age under its year and keeps the age alongside', () => {
    const result = extractLogMarker(
      'At 7, I discovered the mini-games hidden in Microsoft Office.',
    );

    expect(result).toEqual({
      year: '1997',
      age: 'Age 7',
      rest: 'I discovered the mini-games hidden in Microsoft Office.',
    });
  });

  it('lifts an age range, with or without the leading "At"', () => {
    expect(
      extractLogMarker('At 14 - 17, I played a lot of video games.'),
    ).toEqual({
      year: '2004–2007',
      age: 'Age 14–17',
      rest: 'I played a lot of video games.',
    });

    expect(extractLogMarker('14 - 17, I played a lot of video games.')).toEqual(
      {
        year: '2004–2007',
        age: 'Age 14–17',
        rest: 'I played a lot of video games.',
      },
    );
  });

  it('accepts en and em dashes in a range', () => {
    expect(extractLogMarker('At 14–17, I played games.')?.age).toBe(
      'Age 14–17',
    );
    expect(extractLogMarker('At 14—17, I played games.')?.age).toBe(
      'Age 14–17',
    );
  });

  it('gives a leading year the age that goes with it', () => {
    expect(extractLogMarker('In 2016, I visited Canada and Ethiopia.')).toEqual(
      {
        year: '2016',
        age: 'Age 26',
        rest: 'I visited Canada and Ethiopia.',
      },
    );
  });

  it('reads a year through a season', () => {
    expect(
      extractLogMarker('In the summer of 1996, my uncle purchased MegaRace.'),
    ).toEqual({
      year: '1996',
      age: 'Age 6',
      rest: 'My uncle purchased MegaRace.',
    });
  });

  it('recapitalises the remainder, which now opens the sentence', () => {
    expect(extractLogMarker('At 20, co-authored a grant.')?.rest).toBe(
      'Co-authored a grant.',
    );
  });

  it('lifts an age the sentence is built around', () => {
    expect(
      extractLogMarker('When I was 12, I set the all-time high record.'),
    ).toEqual({
      year: '2002',
      age: 'Age 12',
      rest: 'I set the all-time high record.',
    });

    expect(
      extractLogMarker('I was 11 when I built my first Tesla Coil.'),
    ).toEqual({
      year: '2001',
      age: 'Age 11',
      rest: 'I built my first Tesla Coil.',
    });
  });

  it('annotates a marker embedded in the prose without editing the prose', () => {
    // The words carry the date, so the gutter reads it rather than removes it.
    expect(
      extractLogMarker(
        'My parents put a computer in my bedroom in 1993 when I was 3. It was an old Tandy.',
      ),
    ).toEqual({
      year: '1993',
      age: 'Age 3',
      rest: 'My parents put a computer in my bedroom in 1993 when I was 3. It was an old Tandy.',
    });

    expect(
      extractLogMarker('We subscribed to AOL in 1995. I still remember it.'),
    ).toEqual({
      year: '1995',
      age: 'Age 5',
      rest: 'We subscribed to AOL in 1995. I still remember it.',
    });

    // Previously null: a mid-sentence year was ignored entirely, which left the
    // best entries on the page with an empty gutter.
    expect(extractLogMarker('I visited Canada in 2016, then Japan.')).toEqual({
      year: '2016',
      age: 'Age 26',
      rest: 'I visited Canada in 2016, then Japan.',
    });
  });

  it('only reads a marker out of the opening sentence', () => {
    expect(
      extractLogMarker('I still have it. I bought it in 1998.'),
    ).toBeNull();
  });

  it('leaves entries that carry no temporal marker at all alone', () => {
    for (const text of [
      'I am an Oregon Trail II enthusiast.',
      'I am originally from Buffalo, New York. I have since lived in Palo Alto.',
      "I've been to approximately 50 countries, some of which I have forgotten.",
      'I have a list of thousands of ideas.',
    ]) {
      expect(extractLogMarker(text)).toBeNull();
    }
  });

  it('does not read a number that is not a date as a year', () => {
    // Every string here contains a run of digits that `YEAR_PATTERN` matches on
    // its own, which is what makes this test able to fail: relax any part of
    // the inline year guard — the preposition anchor, either word boundary, or
    // the 18xx/19xx/20xx shape — and one of these arrives in the gutter as a
    // date. The prose the guard was written for cannot do that. "Mavica
    // MVC-FD71", "Nikon D750", "Pentium III", "approximately 50 countries" hold
    // no four-digit run at all, so a test built from them passes against a
    // guard that has been deleted.
    for (const text of [
      // An unprefixed model number: nothing here says this 2000 is a date.
      'It was an old Tandy 2000 that ran MS-DOS.',
      // "Garmin" ends in "in", which is a preposition only across a boundary.
      'I still navigate with a Garmin 2000 on the bike.',
      // A decade is not a year, and "1990s" is not "1990".
      'I kept a box of 1990s computer magazines.',
      // Four digits that are a quantity rather than a year-shaped number.
      'The whole shoot fit on a floppy of 1440 KB.',
    ]) {
      expect(extractLogMarker(text), text).toBeNull();
    }

    // The same number, prefixed, is a date: the anchor separates the two, and
    // has not simply turned the guard into a refusal to read anything.
    expect(
      extractLogMarker('I retired that Tandy in 2000, after seven years.')
        ?.year,
    ).toBe('2000');
  });

  it('omits the age for a year that predates the birth year', () => {
    const result = extractLogMarker(`In ${BIRTH_YEAR - 10}, none of this.`);

    expect(result?.year).toBe(String(BIRTH_YEAR - 10));
    expect(result?.age).toBeUndefined();
  });

  it('rejects a marker with nothing left after it', () => {
    expect(extractLogMarker('At 20, ')).toBeNull();
    expect(extractLogMarker('In 2016, ')).toBeNull();
  });

  it('is case-insensitive on the leading word', () => {
    expect(extractLogMarker('at 13, I went to space camp.')?.age).toBe(
      'Age 13',
    );
    expect(extractLogMarker('in 2019, I visited Canada.')?.year).toBe('2019');
  });
});

describe('the about page log', () => {
  const history = sectionEntries('Some History');

  it('dates every entry in Some History', () => {
    expect(history).toHaveLength(15);

    for (const entry of history) {
      const marker = extractLogMarker(entry);

      expect(marker, entry.slice(0, 60)).not.toBeNull();
      expect(marker?.year).toMatch(/^\d{4}(–\d{4})?$/);
      expect(marker?.age).toMatch(/^Age \d{1,2}(–\d{1,2})?$/);
    }
  });

  it('starts at the year the profile says the computing started', () => {
    // `profile.computingSince` and the Tandy in the bedroom are the same fact;
    // the log opened with an empty gutter while the stats page claimed 1993.
    expect(extractLogMarker(history[0])?.year).toBe(
      String(profile.computingSince),
    );
  });

  it('reads years and ages off one clock', () => {
    // Where the prose states both — "in 1993 when I was 3" — the two must
    // agree, or the gutter is quietly inventing a second timeline.
    for (const entry of history) {
      const marker = extractLogMarker(entry);
      const statedYear = entry.match(/\b((?:19|20)\d{2})\b/);
      const statedAge = marker?.age?.match(/\d{1,2}/);

      if (statedYear && statedAge) {
        expect(
          Number.parseInt(statedYear[1], 10) - BIRTH_YEAR,
          entry.slice(0, 60),
        ).toBe(Number.parseInt(statedAge[0], 10));
      }
    }
  });

  it('leaves the undated travel entries with no marker rather than a broken one', () => {
    const travel = sectionEntries('Travel / Geography');
    const undated = travel.filter((entry) => extractLogMarker(entry) === null);

    expect(undated).toHaveLength(3);
    expect(travel.length - undated.length).toBe(8);
  });
});
