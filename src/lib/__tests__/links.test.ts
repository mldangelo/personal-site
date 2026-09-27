import { describe, expect, it } from 'vitest';

import { isExternalHref, newTabProps } from '../links';
import { SITE_URL } from '../utils';

describe('isExternalHref', () => {
  it('treats other origins as external', () => {
    expect(isExternalHref('https://www.nutanix.com')).toBe(true);
    expect(isExternalHref('http://cs229.stanford.edu/')).toBe(true);
  });

  it('keeps this site, hashes, paths, and mail in the current tab', () => {
    expect(isExternalHref(`${SITE_URL}/resume/`)).toBe(false);
    expect(isExternalHref('/contact')).toBe(false);
    expect(isExternalHref('#experience')).toBe(false);
    expect(isExternalHref('mailto:charan.reddy.1605@gmail.com')).toBe(false);
    expect(isExternalHref(undefined)).toBe(false);
  });
});

describe('newTabProps', () => {
  it('adds a new-tab target only for off-site http(s)', () => {
    expect(newTabProps('https://github.com/vsricharan16')).toEqual({
      target: '_blank',
      rel: 'noopener noreferrer',
    });
    expect(newTabProps('/about')).toEqual({});
  });
});
