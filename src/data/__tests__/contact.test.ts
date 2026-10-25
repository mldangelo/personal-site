import { describe, expect, it } from 'vitest';

import contact from '../contact';
import profile from '../profile.json';

/**
 * The one Font Awesome icon each label may be drawn with. Written out here,
 * apart from the data, because both failures this guards were an edit to one
 * half of a pair: the link named X kept the Twitter bird, and the Wellfound
 * profile kept AngelList's name, address, and hand.
 */
const MARK_FOR: Record<string, string> = {
  GitHub: 'github',
  LinkedIn: 'linkedin-in',
  X: 'x-twitter',
  Email: 'envelope',
  Instagram: 'instagram',
  Facebook: 'facebook-f',
};

describe('contact destinations', () => {
  it('leads with the four people use, in the order the footer prints them', () => {
    expect(contact.slice(0, 4).map((item) => item.id)).toEqual([
      'github',
      'linkedin',
      'x',
      'email',
    ]);
  });

  it('lists each destination once', () => {
    for (const key of ['id', 'label', 'link'] as const) {
      const values = contact.map((item) => item[key]);

      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('links every profile over https, and email at the one public address', () => {
    const mailto = contact.filter((item) => item.link.startsWith('mailto:'));

    expect(mailto.map((item) => item.link)).toEqual([
      `mailto:${profile.email}`,
    ]);
    for (const item of contact) {
      if (!mailto.includes(item)) {
        expect(new URL(item.link).protocol).toBe('https:');
      }
    }
  });

  it('draws an icon only for the label that icon names', () => {
    const marked = contact.filter((item) => item.icon);

    expect(marked.length).toBeGreaterThan(0);
    for (const item of marked) {
      expect(item.icon?.iconName, `the icon for ${item.label}`).toBe(
        MARK_FOR[item.label],
      );
    }
  });

  // Both were live here long after the services behind them had been renamed.
  it('uses no name or address a destination has since dropped', () => {
    const labels = contact.map((item) => item.label.toLowerCase());
    const hosts = contact
      .filter((item) => !item.link.startsWith('mailto:'))
      .map((item) => new URL(item.link).hostname.replace(/^www\./, ''));

    for (const retired of ['twitter', 'angel list', 'angellist']) {
      expect(labels).not.toContain(retired);
    }
    for (const retired of ['twitter.com', 'angel.co']) {
      expect(hosts).not.toContain(retired);
    }
  });
});
