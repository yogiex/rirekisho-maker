import { z } from 'zod';
import { strings } from '@/lib/constants/strings';
import { normalizeWidth } from '@/lib/utils/normalize';

export const MOTIVATION_MAX = 400;
export const REQUESTS_MAX = 300;

// ---------- literals (RULES §2: as const, no enums) ----------
export const GENDER_VALUES = ['male', 'female', 'none'] as const;
export type Gender = (typeof GENDER_VALUES)[number];

export const HISTORY_CATEGORIES = ['education', 'work'] as const;
export type HistoryCategory = (typeof HISTORY_CATEGORIES)[number];

export const EDUCATION_ACTIONS = ['入学', '転学', '退学', '卒業'] as const;
export const WORK_ACTIONS = ['入社', '退社', '異動'] as const;
export type HistoryAction =
  | (typeof EDUCATION_ACTIONS)[number]
  | (typeof WORK_ACTIONS)[number];

export const DRAFT_VERSION = 1;

// ---------- regexes ----------
const FURIGANA_RE = /^[\u3040-\u309Fー]+$/;
const POSTAL_RE = /^\d{3}-?\d{4}$/;
const PHONE_RE = /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/;
const E = strings.errors;

// ---------- helpers ----------
/** Width-normalize + trim before validating (schema-level guarantee, FEATURE §7). */
const widthText = (schema: z.ZodString) =>
  z.preprocess((v) => (typeof v === 'string' ? normalizeWidth(v).trim() : v), schema);

const optionalFurigana = widthText(
  z.string().max(40, E.required).refine((v) => v === '' || FURIGANA_RE.test(v), E.furigana),
);

export const jpDateSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
});
export type JpDate = z.infer<typeof jpDateSchema>;

export interface JpFullDate {
  year: number;
  month: number;
  day: number;
}

// ---------- cross-field refines ----------
type ContactShape = {
  alternateContactEnabled: boolean;
  alternateContact?: { relation: string; name: string; phone: string };
};

export function refineAlternateContact(v: ContactShape, ctx: z.RefinementCtx): void {
  if (!v.alternateContactEnabled) return;
  const c = v.alternateContact;
  if (!c || c.relation.trim() === '')
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['alternateContact', 'relation'], message: E.required });
  if (!c || c.name.trim() === '')
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['alternateContact', 'name'], message: E.required });
  if (!c || c.phone.trim() === '')
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['alternateContact', 'phone'], message: E.required });
}

type HistoryShape = { history: { category: HistoryCategory; action: HistoryAction }[] };

export function refineHistoryActions(v: HistoryShape, ctx: z.RefinementCtx): void {
  v.history.forEach((h, i) => {
    const valid =
      h.category === 'education'
        ? (EDUCATION_ACTIONS as readonly string[]).includes(h.action)
        : (WORK_ACTIONS as readonly string[]).includes(h.action);
    if (!valid)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['history', i, 'action'], message: E.actionMismatch });
  });
}

// ---------- factory: `today` injected for testability (RULES §9) ----------
export function createRirekishoSchema(today: Date) {
  const thisYear = today.getFullYear();

  const jpFullDateSchema = z
    .object({
      year: z.number().int().min(1900).max(thisYear),
      month: z.number().int().min(1).max(12),
      day: z.number().int().min(1).max(31),
    })
    .superRefine((v, ctx) => {
      const dt = new Date(v.year, v.month - 1, v.day);
      const validCalendar =
        dt.getFullYear() === v.year && dt.getMonth() === v.month - 1 && dt.getDate() === v.day;
      if (!validCalendar)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['day'], message: E.invalidDate });
      const isFuture =
        v.year > today.getFullYear() ||
        (v.year === today.getFullYear() &&
          (v.month > today.getMonth() + 1 ||
            (v.month === today.getMonth() + 1 && v.day > today.getDate())));
      if (isFuture)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['day'], message: E.futureDate });
    });

  const alternateContactSchema = z.object({
    relation: widthText(z.string().max(30)),
    name: widthText(z.string().max(60)),
    phone: widthText(z.string().max(20).refine((v) => v === '' || PHONE_RE.test(v), E.phone)),
  });

  const historyEntrySchema = z.object({
    id: z.string().min(1),
    date: jpDateSchema,
    category: z.enum(HISTORY_CATEGORIES),
    name: widthText(z.string().min(1, E.required).max(60)),
    nameFurigana: optionalFurigana,
    action: z.union([z.enum(EDUCATION_ACTIONS), z.enum(WORK_ACTIONS)]),
    detail: widthText(z.string().max(60)),
  });

  const licenseEntrySchema = z.object({
    id: z.string().min(1),
    date: jpDateSchema,
    name: widthText(z.string().min(1, E.required).max(60)),
    issuer: widthText(z.string().max(60)),
  });

  const base = z.object({
    fillDate: jpFullDateSchema,

    photo: z.string().optional(),

    furigana: widthText(z.string().min(1, E.required).max(40).refine((v) => FURIGANA_RE.test(v), E.furigana)),
    fullName: widthText(z.string().min(1, E.required).max(40)),
    dateOfBirth: jpFullDateSchema,
    gender: z.enum(GENDER_VALUES),
    postalCode: widthText(z.string().min(1, E.required).refine((v) => POSTAL_RE.test(v), E.postal)),
    prefecture: z.string().min(1, E.required),
    address: widthText(z.string().min(1, E.required).max(100)),
    addressFurigana: optionalFurigana,
    phone: widthText(z.string().refine((v) => v === '' || PHONE_RE.test(v), E.phone)),
    email: widthText(z.string().refine((v) => v === '' || z.string().email().safeParse(v).success, E.email)),
    alternateContactEnabled: z.boolean(),
    alternateContact: alternateContactSchema.optional(),

    history: z.array(historyEntrySchema),
    historyCurrent: z.boolean(),

    licenses: z.array(licenseEntrySchema),

    specialties: widthText(z.string().max(50)),
    hobbies: widthText(z.string().max(50)),
    motivation: widthText(z.string().max(MOTIVATION_MAX)),
    commuteHours: z.number().int().min(0).max(3),
    commuteMinutes: z.number().int().min(0).max(59),
    spouse: z.boolean(),
    dependents: z.number().int().min(0).max(20),
    requests: widthText(z.string().max(REQUESTS_MAX)),
  });

  return { base, alternateContactSchema, historyEntrySchema, licenseEntrySchema, jpFullDateSchema };
}

// ---------- app-wide instance ----------
const { base: baseSchema } = createRirekishoSchema(new Date());
export type RirekishoData = z.infer<typeof baseSchema>;
export type HistoryEntry = RirekishoData['history'][number];
export type LicenseEntry = RirekishoData['licenses'][number];
export type AlternateContact = NonNullable<RirekishoData['alternateContact']>;

export const rirekishoSchema = baseSchema
  .superRefine(refineAlternateContact)
  .superRefine(refineHistoryActions);

// ---------- default values ----------
export function createDefaultDraft(today: Date): RirekishoData {
  return {
    fillDate: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
    photo: undefined,
    furigana: '',
    fullName: '',
    dateOfBirth: { year: 1990, month: 1, day: 1 },
    gender: 'none',
    postalCode: '',
    prefecture: '',
    address: '',
    addressFurigana: '',
    phone: '',
    email: '',
    alternateContactEnabled: false,
    alternateContact: undefined,
    history: [],
    historyCurrent: false,
    licenses: [],
    specialties: '',
    hobbies: '',
    motivation: '',
    commuteHours: 0,
    commuteMinutes: 0,
    spouse: false,
    dependents: 0,
    requests: '',
  };
}

// ---------- step gating (RULES §8.1) ----------
export const stepSchemas = {
  1: baseSchema
    .pick({
      photo: true, furigana: true, fullName: true, dateOfBirth: true, gender: true,
      postalCode: true, prefecture: true, address: true, addressFurigana: true,
      phone: true, email: true, alternateContactEnabled: true, alternateContact: true,
    })
    .superRefine(refineAlternateContact),
  2: baseSchema
    .pick({ history: true, historyCurrent: true })
    .superRefine(refineHistoryActions),
  3: baseSchema.pick({ licenses: true }),
  4: baseSchema.pick({
    specialties: true, hobbies: true, motivation: true, commuteHours: true,
    commuteMinutes: true, spouse: true, dependents: true, requests: true,
  }),
} as const;

/** Field paths per step for `form.trigger()` (A-4). */
export const stepFields = {
  1: [
    'photo', 'furigana', 'fullName', 'dateOfBirth.year', 'dateOfBirth.month', 'dateOfBirth.day',
    'gender', 'postalCode', 'prefecture', 'address', 'addressFurigana', 'phone', 'email',
    'alternateContact.relation', 'alternateContact.name', 'alternateContact.phone',
  ],
  2: ['history', 'historyCurrent'],
  3: ['licenses'],
  4: ['specialties', 'hobbies', 'motivation', 'commuteHours', 'commuteMinutes', 'spouse', 'dependents', 'requests'],
} as const;
