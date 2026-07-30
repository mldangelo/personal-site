import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import profile from '@/data/profile.json';
import { extractLogMarker } from '../logEntry';

/** Bullets of one about-page section, as authored. */
function sectionEntries(title: string) {
  const body = aboutMarkdown.split(`# ${title}\n`)[1]?.split('\n# ')[0] ?? '';

  return body
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2));
}

describe('extractLogMarker', () => {
  it('lifts a leading age without inventing a year', () => {
    const result = extractLogMarker(
      'At 7, I discovered the mini-games hidden in Microsoft Office.',
    );

    expect(result).toEqual({
      age: 'Age 7',
      rest: 'I discovered the mini-games hidden in Microsoft Office.',
    });
  });

  it('lifts an age range, with or without the leading "At"', () => {
    expect(
      extractLogMarker('At 14 - 17, I played a lot of video games.'),
    ).toEqual({
      age: 'Age 14–17',
      rest: 'I played a lot of video games.',
    });

    expect(extractLogMarker('14 - 17, I played a lot of video games.')).toEqual(
      {
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

  it('lifts a leading year without inventing an age', () => {
    expect(extractLogMarker('In 2016, I visited Canada and Ethiopia.')).toEqual(
      {
        year: '2016',
        rest: 'I visited Canada and Ethiopia.',
      },
    );
  });

  it('annotates a seasonal year without deleting the season', () => {
    expect(
      extractLogMarker('In the summer of 1996, my uncle purchased MegaRace.'),
    ).toEqual({
      year: '1996',
      rest: 'In the summer of 1996, my uncle purchased MegaRace.',
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
      age: 'Age 12',
      rest: 'I set the all-time high record.',
    });

    expect(
      extractLogMarker('I was 11 when I built my first Tesla Coil.'),
    ).toEqual({
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
      rest: 'We subscribed to AOL in 1995. I still remember it.',
    });

    // Previously null: a mid-sentence year was ignored entirely, which left the
    // best entries on the page with an empty gutter.
    expect(extractLogMarker('I visited Canada in 2016, then Japan.')).toEqual({
      year: '2016',
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
    // One string per part of the inline year guard, which is what makes this
    // test able to fail: relax the preposition anchor, either word boundary, or
    // the 18xx/19xx/20xx shape, and exactly one of these arrives in the gutter
    // as a date. The prose the guard was written for cannot do that — "Mavica
    // MVC-FD71", "Nikon D750" and "Pentium III" hold no digit run either inline
    // pattern can reach, so a test built from them passes against a guard that
    // has been deleted.
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

  it('does not read a bare count as an age', () => {
    // The other inline anchor, which holds back a different number: a small
    // quantity, not a model number. Drop "I was" / "at the age of" from
    // `INLINE_AGE` and this one is filed as Age 50, in 2040.
    expect(
      extractLogMarker(
        "I've been to approximately 50 countries, some of which I have forgotten.",
      ),
    ).toBeNull();

    // The same number after the anchor still reads, mid-sentence and so through
    // `INLINE_AGE` rather than a leading pattern: the guard is a distinction,
    // not a refusal.
    expect(
      extractLogMarker('I set the record at my local laser tag when I was 12.')
        ?.age,
    ).toBe('Age 12');
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

  it('annotates every history entry with only its stated marker', () => {
    expect(history).toHaveLength(15);

    expect(
      history.map((entry) => {
        const { year, age } = extractLogMarker(entry) ?? {};
        return [year, age].filter(Boolean).join(' / ');
      }),
    ).toEqual([
      '1993 / Age 3',
      '1995',
      '1996',
      'Age 7',
      'Age 8',
      'Age 10',
      'Age 11',
      'Age 12',
      'Age 13',
      'Age 14',
      'Age 14–17',
      'Age 16',
      'Age 18',
      'Age 19',
      'Age 20',
    ]);
  });

  it('starts at the year the profile says the computing started', () => {
    // `profile.computingSince` and the Tandy in the bedroom are the same fact;
    // the log opened with an empty gutter while the stats page claimed 1993.
    expect(extractLogMarker(history[0])?.year).toBe(
      String(profile.computingSince),
    );
  });

  it('keeps the seasonal qualifier in the real MegaRace entry', () => {
    const megaRace = history.find((entry) => entry.includes('MegaRace'));
    const marker = extractLogMarker(megaRace ?? '');

    expect(marker?.year).toBe('1996');
    expect(marker?.age).toBeUndefined();
    expect(marker?.rest).toContain('In the summer of 1996');
  });

  it('leaves undated travel entries empty and does not derive travel ages', () => {
    const travel = sectionEntries('Travel / Geography');
    const undated = travel.filter((entry) => extractLogMarker(entry) === null);
    const dated = travel
      .map((entry) => extractLogMarker(entry))
      .filter((marker) => marker !== null);

    expect(undated).toHaveLength(3);
    expect(dated).toHaveLength(8);
    expect(dated.map((marker) => marker.year)).toEqual([
      '2016',
      '2017',
      '2018',
      '2019',
      '2020',
      '2021',
      '2022',
      '2023',
    ]);
    expect(dated.every((marker) => marker.age === undefined)).toBe(true);
  });
});
