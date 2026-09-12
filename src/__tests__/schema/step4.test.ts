import { describe, expect, it } from 'vitest';
import { MOTIVATION_MAX, REQUESTS_MAX, stepSchemas } from '@/lib/schema/rirekisho-schema';

const schema = stepSchemas[4];

const valid = {
  specialties: '料理',
  hobbies: '読書',
  motivation: '貴社の〇〇事業に貢献したいと考えております。',
  commuteHours: 1,
  commuteMinutes: 30,
  spouse: false,
  dependents: 2,
  requests: '',
};

const empty = {
  specialties: '',
  hobbies: '',
  motivation: '',
  commuteHours: 0,
  commuteMinutes: 0,
  spouse: false,
  dependents: 0,
  requests: '',
};

const hasIssueAt = (result: ReturnType<typeof schema.safeParse>, path: string) =>
  !result.success && result.error.issues.some((i) => i.path.join('.') === path);

describe('stepSchemas[4] (specialties / motivation / commute / family / requests)', () => {
  it('accepts a fully valid object', () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it('accepts an all-empty object', () => {
    expect(schema.safeParse(empty).success).toBe(true);
  });

  it('accepts motivation of exactly MOTIVATION_MAX characters', () => {
    expect(schema.safeParse({ ...valid, motivation: 'あ'.repeat(MOTIVATION_MAX) }).success).toBe(true);
  });

  it('rejects motivation of MOTIVATION_MAX + 1 characters', () => {
    const result = schema.safeParse({ ...valid, motivation: 'あ'.repeat(MOTIVATION_MAX + 1) });
    expect(result.success).toBe(false);
    expect(hasIssueAt(result, 'motivation')).toBe(true);
  });

  it('accepts requests of exactly REQUESTS_MAX characters', () => {
    expect(schema.safeParse({ ...valid, requests: 'あ'.repeat(REQUESTS_MAX) }).success).toBe(true);
  });

  it('rejects requests of REQUESTS_MAX + 1 characters', () => {
    const result = schema.safeParse({ ...valid, requests: 'あ'.repeat(REQUESTS_MAX + 1) });
    expect(result.success).toBe(false);
    expect(hasIssueAt(result, 'requests')).toBe(true);
  });

  it('rejects specialties of 51 characters', () => {
    const result = schema.safeParse({ ...valid, specialties: 'あ'.repeat(51) });
    expect(result.success).toBe(false);
    expect(hasIssueAt(result, 'specialties')).toBe(true);
  });

  it('accepts commuteHours 3 and rejects 4', () => {
    expect(schema.safeParse({ ...valid, commuteHours: 3 }).success).toBe(true);
    const result = schema.safeParse({ ...valid, commuteHours: 4 });
    expect(result.success).toBe(false);
    expect(hasIssueAt(result, 'commuteHours')).toBe(true);
  });

  it('accepts commuteMinutes 59 and rejects 60', () => {
    expect(schema.safeParse({ ...valid, commuteMinutes: 59 }).success).toBe(true);
    const result = schema.safeParse({ ...valid, commuteMinutes: 60 });
    expect(result.success).toBe(false);
    expect(hasIssueAt(result, 'commuteMinutes')).toBe(true);
  });

  it('accepts dependents 20 and rejects 21', () => {
    expect(schema.safeParse({ ...valid, dependents: 20 }).success).toBe(true);
    const result = schema.safeParse({ ...valid, dependents: 21 });
    expect(result.success).toBe(false);
    expect(hasIssueAt(result, 'dependents')).toBe(true);
  });
});
