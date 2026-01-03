import { describe, expect, it } from 'vitest';

import { buildJsonResume } from '../resume';

describe('JSON Resume export', () => {
  const resume = buildJsonResume();

  it('has valid schema reference', () => {
    expect(resume.$schema).toContain('jsonresume');
  });

  describe('basics section', () => {
    it('has all required fields', () => {
      expect(resume.basics).toHaveProperty('name');
      expect(resume.basics).toHaveProperty('label');
      expect(resume.basics).toHaveProperty('email');
      expect(resume.basics).toHaveProperty('summary');
      expect(resume.basics).toHaveProperty('profiles');
    });

    it('name is non-empty', () => {
      expect(resume.basics.name.trim().length).toBeGreaterThan(0);
    });

    it('email is valid format', () => {
      expect(resume.basics.email).toMatch(/@/);
    });

    it('url is valid when present', () => {
      if (resume.basics.url) {
        expect(resume.basics.url).toMatch(/^https?:\/\//);
      }
    });

    it('profiles is an array', () => {
      expect(Array.isArray(resume.basics.profiles)).toBe(true);
    });

    it('each profile has required fields', () => {
      for (const profile of resume.basics.profiles) {
        expect(profile).toHaveProperty('network');
        expect(profile).toHaveProperty('url');
        expect(profile.url).toMatch(/^https?:\/\//);
      }
    });

    it('location has valid structure when present', () => {
      if (resume.basics.location) {
        expect(resume.basics.location).toHaveProperty('countryCode');
      }
    });
  });

  describe('work section', () => {
    it('has work entries', () => {
      expect(Array.isArray(resume.work)).toBe(true);
      expect(resume.work.length).toBeGreaterThan(0);
    });

    it('each work entry has required fields', () => {
      for (const job of resume.work) {
        expect(job).toHaveProperty('name');
        expect(job).toHaveProperty('position');
        expect(job).toHaveProperty('startDate');
        expect(job.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('endDate is valid ISO format when present', () => {
      for (const job of resume.work) {
        if (job.endDate) {
          expect(job.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      }
    });
  });

  describe('education section', () => {
    it('has education entries', () => {
      expect(Array.isArray(resume.education)).toBe(true);
      expect(resume.education.length).toBeGreaterThan(0);
    });

    it('each education entry has required fields', () => {
      for (const edu of resume.education) {
        expect(edu).toHaveProperty('institution');
        expect(edu).toHaveProperty('studyType');
        expect(edu).toHaveProperty('area');
        expect(edu).toHaveProperty('startDate');
        expect(edu).toHaveProperty('endDate');
      }
    });

    it('courses is an array', () => {
      for (const edu of resume.education) {
        expect(Array.isArray(edu.courses)).toBe(true);
      }
    });

    it('institution names are non-empty', () => {
      for (const edu of resume.education) {
        expect(edu.institution.trim().length).toBeGreaterThan(0);
      }
    });
  });

  describe('skills section', () => {
    it('has skills entries', () => {
      expect(Array.isArray(resume.skills)).toBe(true);
      expect(resume.skills.length).toBeGreaterThan(0);
    });

    it('each skill has required fields', () => {
      for (const skill of resume.skills) {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('level');
        expect(skill).toHaveProperty('keywords');
        expect(Array.isArray(skill.keywords)).toBe(true);
      }
    });

    it('keywords are non-empty arrays', () => {
      for (const skill of resume.skills) {
        expect(skill.keywords.length).toBeGreaterThan(0);
        for (const keyword of skill.keywords) {
          expect(typeof keyword).toBe('string');
          expect(keyword.trim().length).toBeGreaterThan(0);
        }
      }
    });

    it('level is a valid string', () => {
      const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Master'];
      for (const skill of resume.skills) {
        expect(validLevels).toContain(skill.level);
      }
    });
  });

  describe('projects section', () => {
    it('has projects entries', () => {
      expect(Array.isArray(resume.projects)).toBe(true);
      expect(resume.projects.length).toBeGreaterThan(0);
    });

    it('each project has required fields', () => {
      for (const project of resume.projects) {
        expect(project).toHaveProperty('name');
        expect(project).toHaveProperty('description');
        expect(project.name.trim().length).toBeGreaterThan(0);
        expect(project.description.trim().length).toBeGreaterThan(0);
      }
    });

    it('url is valid when present', () => {
      for (const project of resume.projects) {
        if (project.url) {
          expect(project.url).toMatch(/^https?:\/\//);
        }
      }
    });
  });

  describe('meta section', () => {
    it('has meta information', () => {
      expect(resume.meta).toBeDefined();
    });

    it('canonical url is valid when present', () => {
      if (resume.meta?.canonical) {
        expect(resume.meta.canonical).toMatch(/^https?:\/\//);
      }
    });

    it('lastModified is valid date format when present', () => {
      if (resume.meta?.lastModified) {
        expect(resume.meta.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  });
});
