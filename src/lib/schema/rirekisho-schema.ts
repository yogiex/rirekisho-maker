import { z } from 'zod';

const furiganaRegex = /^[\u3040-\u309Fー]+$/;
const postalRegex = /^\d{3}-?\d{4}$/;
const phoneRegex = /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/;

const jpDateSchema = z.object({
  year: z.number().min(1900).max(2100),
  month: z.number().min(1).max(12),
});

const historyEntrySchema = z.object({
  id: z.string(),
  date: jpDateSchema,
  category: z.enum(['education', 'work']),
  name: z.string().min(1, '名前を入力してください').max(60),
  nameFurigana: z.string().optional(),
  action: z.string().min(1, '区分を選択してください'),
  detail: z.string().optional(),
});

const licenseEntrySchema = z.object({
  id: z.string(),
  date: jpDateSchema,
  name: z.string().min(1, '資格名を入力してください').max(60),
  issuer: z.string().optional(),
});

const alternateContactSchema = z.object({
  relation: z.string().min(1, '続柄を入力してください'),
  name: z.string().min(1, '名前を入力してください'),
  phone: z.string().regex(phoneRegex, '電話番号の形式で入力してください'),
});

export const rirekishoSchema = z.object({
  fillDate: jpDateSchema,
  photo: z.string().optional(),
  furigana: z.string().regex(furiganaRegex, 'ひらがなで入力してください').max(40),
  fullName: z.string().min(1, '氏名を入力してください').max(40),
  dateOfBirth: jpDateSchema,
  gender: z.enum(['male', 'female', 'none']).default('none'),
  postalCode: z.string().regex(postalRegex, '郵便番号の形式で入力してください（例: 123-4567）'),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  address: z.string().min(1, '住所を入力してください').max(100),
  addressFurigana: z.string().optional().or(z.literal('')),
  phone: z.string().regex(phoneRegex, '電話番号の形式で入力してください').optional().or(z.literal('')),
  email: z.string().email('メールアドレスの形式で入力してください').optional().or(z.literal('')),
  alternateContactEnabled: z.boolean().default(false),
  alternateContact: alternateContactSchema.optional(),
  history: z.array(historyEntrySchema),
  historyCurrent: z.boolean().default(false),
  licenses: z.array(licenseEntrySchema),
  specialties: z.string().max(50).optional().or(z.literal('')),
  hobbies: z.string().max(50).optional().or(z.literal('')),
  motivation: z.string().max(400, '志望動機は400字以内で入力してください').optional().or(z.literal('')),
  commuteHours: z.number().min(0).max(3).default(0),
  commuteMinutes: z.number().min(0).max(59).default(0),
  spouse: z.boolean().default(false),
  dependents: z.number().min(0).max(20).default(0),
  requests: z.string().max(300, '本人希望記入欄は300字以内で入力してください').optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.alternateContactEnabled && !data.alternateContact) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '連絡先情報を入力してください',
      path: ['alternateContact'],
    });
  }
});

export type RirekishoFormData = z.infer<typeof rirekishoSchema>;

export function getDefaultValues(): RirekishoFormData {
  const now = new Date();
  return {
    fillDate: { year: now.getFullYear(), month: now.getMonth() + 1 },
    furigana: '',
    fullName: '',
    dateOfBirth: { year: 1990, month: 1 },
    gender: 'none',
    postalCode: '',
    prefecture: '',
    address: '',
    addressFurigana: '',
    phone: '',
    email: '',
    alternateContactEnabled: false,
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
