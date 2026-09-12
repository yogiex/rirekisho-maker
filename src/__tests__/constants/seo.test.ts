import { describe, expect, it } from 'vitest';
import { SEO } from '@/lib/constants/seo';
import { strings } from '@/lib/constants/strings';

describe('SEO constants', () => {
  it('siteUrl has no trailing slash', () => {
    expect(SEO.siteUrl.endsWith('/')).toBe(false);
  });

  it('ogImage has no leading slash', () => {
    expect(SEO.ogImage.startsWith('/')).toBe(false);
  });

  it('title and description are non-empty', () => {
    expect(SEO.title.length).toBeGreaterThan(0);
    expect(SEO.description.length).toBeGreaterThan(0);
  });
});

describe('strings.faq', () => {
  it('has exactly 6 items', () => {
    expect(strings.faq).toHaveLength(6);
  });

  it('every item has non-empty question and answer', () => {
    for (const item of strings.faq) {
      expect(item.question.trim().length).toBeGreaterThan(0);
      expect(item.answer.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('strings.seo', () => {
  it('has non-empty JSON-LD app name and description', () => {
    expect(strings.seo.jsonLdAppName.length).toBeGreaterThan(0);
    expect(strings.seo.jsonLdAppDesc.length).toBeGreaterThan(0);
  });
});
