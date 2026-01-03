import { describe, expect, it } from 'vitest';

import profile from '../profile';

describe('profile data', () => {
  it('has required fields', () => {
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('label');
    expect(profile).toHaveProperty('email');
    expect(profile).toHaveProperty('url');
    expect(profile).toHaveProperty('summary');
    expect(profile).toHaveProperty('tagline');
    expect(profile).toHaveProperty('bio');
    expect(profile).toHaveProperty('bioHtml');
    expect(profile).toHaveProperty('chips');
    expect(profile).toHaveProperty('location');
    expect(profile).toHaveProperty('company');
  });

  it('name is non-empty', () => {
    expect(profile.name.trim().length).toBeGreaterThan(0);
  });

  it('email is valid format', () => {
    expect(profile.email).toMatch(/@/);
    expect(profile.email).toMatch(/\.\w+$/);
  });

  it('url is valid', () => {
    expect(profile.url).toMatch(/^https?:\/\//);
  });

  it('summary is non-empty', () => {
    expect(profile.summary.trim().length).toBeGreaterThan(0);
  });

  it('tagline is a non-empty array', () => {
    expect(Array.isArray(profile.tagline)).toBe(true);
    expect(profile.tagline.length).toBeGreaterThan(0);
    for (const line of profile.tagline) {
      expect(line.trim().length).toBeGreaterThan(0);
    }
  });

  it('bio is non-empty', () => {
    expect(profile.bio.trim().length).toBeGreaterThan(0);
  });

  it('bioHtml contains links', () => {
    expect(profile.bioHtml).toContain('<a href=');
    expect(profile.bioHtml).toContain('promptfoo.dev');
  });

  it('chips is a non-empty array', () => {
    expect(Array.isArray(profile.chips)).toBe(true);
    expect(profile.chips.length).toBeGreaterThan(0);
    for (const chip of profile.chips) {
      expect(typeof chip).toBe('string');
      expect(chip.trim().length).toBeGreaterThan(0);
    }
  });

  it('location has valid countryCode', () => {
    expect(profile.location).toHaveProperty('city');
    expect(profile.location).toHaveProperty('region');
    expect(profile.location).toHaveProperty('countryCode');
    expect(profile.location.countryCode).toMatch(/^[A-Z]{2}$/);
  });

  it('company has required fields', () => {
    expect(profile.company).toHaveProperty('name');
    expect(profile.company).toHaveProperty('url');
    expect(profile.company).toHaveProperty('role');
    expect(profile.company.name.trim().length).toBeGreaterThan(0);
    expect(profile.company.url).toMatch(/^https?:\/\//);
    expect(profile.company.role.trim().length).toBeGreaterThan(0);
  });

  it('label contains company name', () => {
    expect(profile.label).toContain(profile.company.name);
  });
});
