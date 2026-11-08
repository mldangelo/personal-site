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

const LIFTED = 'I played a lot of video games.';

describe('extractLogMarker', () => {
  it.each([
    ['At 7, I played a lot of video games.', { age: 'Age 7' }],
    ['at 13, I played a lot of video games.', { age: 'Age 13' }],
    ['At 14 - 17, I played a lot of video games.', { age: 'Age 14–17' }],
    ['14 - 17, I played a lot of video games.', { age: 'Age 14–17' }],
    ['At 14–17, I played a lot of video games.', { age: 'Age 14–17' }],
    ['At 14—17, I played a lot of video games.', { age: 'Age 14–17' }],
    ['When I was 12, I played a lot of video games.', { age: 'Age 12' }],
    ['I was 11 when I played a lot of video games.', { age: 'Age 11' }],
    ['In 2016, I played a lot of video games.', { year: '2016' }],
    ['in 2019, I played a lot of video games.', { year: '2019' }],
  ])('lifts the marker and invents no counterpart: %s', (text, marker) => {
    expect(extractLogMarker(text)).toEqual({ ...marker, rest: LIFTED });
  });

  it('recapitalises the remainder, which now opens the sentence', () => {
    expect(extractLogMarker('At 20, co-authored a grant.')?.rest).toBe(
      'Co-authored a grant.',
    );
  });

  it.each([
    // A qualifier stays in the prose, which still carries the date.
    ['In the summer of 1996, my uncle bought MegaRace.', { year: '1996' }],
    [
      'They put a computer in my bedroom in 1993 when I was 3. It was old.',
      { year: '1993', age: 'Age 3' },
    ],
    ['We subscribed to AOL in 1995. I still remember it.', { year: '1995' }],
    ['I visited Canada in 2016, then Japan.', { year: '2016' }],
    // The measure-noun guard is a negative lookahead, so an age with no comma
    // after it survives.
    ['When I was 12 I set a record.', { age: 'Age 12' }],
    ['I was 9 and it rained all week.', { age: 'Age 9' }],
    ['At the age of 16 I drove across the country.', { age: 'Age 16' }],
  ])('annotates without editing the prose: %s', (text, marker) => {
    expect(extractLogMarker(text)).toEqual({ ...marker, rest: text });
  });

  it.each([
    // Only the opening sentence dates an entry.
    'I still have it. I bought it in 1998.',
    // No temporal marker, including a bare count.
    'I am an Oregon Trail II enthusiast.',
    "I've been to approximately 50 countries, some of which I have forgotten.",
    // A measured quantity after "I was" is not an age.
    'I was 6 months into building Promptfoo when the acquisition closed.',
    'I was 1 of 3 founders on that team.',
    'I was 3 hours from the border.',
    'I was 50 miles out and still climbing.',
    'I was 20 percent of the way through the list.',
    'I was 14 - 17 and playing a lot of video games.',
    // A model number is not a year.
    'It was an old Tandy 2000 with a turbo button.',
    'I shoot with a Nikon D750 and a D800 these days.',
    // A marker with nothing left after it.
    'At 20, ',
    'In 2016, ',
  ])('leaves the gutter empty for: %s', (text) => {
    expect(extractLogMarker(text)).toBeNull();
  });
});

describe('the about page log', () => {
  const history = sectionEntries('Some history');

  it('annotates every history entry with only its stated marker', () => {
    expect(extractLogMarker(history[0])?.year).toBe(
      String(profile.computingSince),
    );
    expect(
      history
        .map((entry) => {
          const { year, age } = extractLogMarker(entry) ?? {};
          return [year, age].filter(Boolean).join(' / ');
        })
        .join(', '),
    ).toBe(
      '1993 / Age 3, 1995, 1996, Age 7, Age 8, Age 10, Age 11, Age 12, Age 13, Age 14, Age 14–17, Age 16, Age 18, Age 19, Age 20',
    );
  });

  it('leaves undated travel entries empty and derives no travel ages', () => {
    const markers = sectionEntries('Travel / geography').map(extractLogMarker);
    const dated = markers.filter((marker) => marker !== null);

    expect(markers.length - dated.length).toBe(3);
    expect(dated.map((marker) => marker.year).join(' ')).toBe(
      '2016 2017 2018 2019 2020 2021 2022 2023',
    );
    expect(dated.every((marker) => marker.age === undefined)).toBe(true);
  });
});
