'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form-field';
import { PhotoUpload } from '@/components/wizard/photo-upload';
import { PREFECTURES } from '@/lib/constants/prefectures';
import { strings } from '@/lib/constants/strings';
import { toWareki } from '@/lib/utils/wareki';
import { calculateAge } from '@/lib/utils/age';
import { formatPostal } from '@/lib/utils/format';
import type { RirekishoFormData } from '@/lib/schema/rirekisho-schema';

interface Step1Props {
  data: RirekishoFormData;
  errors: Record<string, string>;
  onUpdate: (field: keyof RirekishoFormData, value: unknown) => void;
}

export function Step1BasicInfo({ data, errors, onUpdate }: Step1Props) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <div className="md:sticky md:top-4 md:self-start">
        <PhotoUpload
          value={data.photo}
          onChange={(v) => onUpdate('photo', v)}
        />
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{strings.step1Title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={strings.furiganaLabel}
                hint={strings.furiganaHint}
                value={data.furigana}
                onChange={(e) => onUpdate('furigana', e.target.value)}
                error={errors.furigana}
                placeholder="たなかはなこ"
              />
              <FormField
                label={strings.fullNameLabel}
                hint={strings.fullNameHint}
                value={data.fullName}
                onChange={(e) => onUpdate('fullName', e.target.value)}
                error={errors.fullName}
                placeholder="田中 花子"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={String(data.dateOfBirth.year)} onValueChange={(v) => onUpdate('dateOfBirth', { ...data.dateOfBirth, year: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="年" /></SelectTrigger>
                <SelectContent>
                  {years.map(y => <SelectItem key={y} value={String(y)}>{y}年 ({toWareki(y, 1).replace('年', '')})</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(data.dateOfBirth.month)} onValueChange={(v) => onUpdate('dateOfBirth', { ...data.dateOfBirth, month: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="月" /></SelectTrigger>
                <SelectContent>
                  {months.map(m => <SelectItem key={m} value={String(m)}>{m}月</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 col-span-2">
                <span className="text-sm text-muted-foreground">{toWareki(data.dateOfBirth.year, data.dateOfBirth.month)}</span>
                <span className="text-sm text-muted-foreground">満{calculateAge(data.dateOfBirth)}歳</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{strings.genderLabel}</Label>
              <RadioGroup value={data.gender} onValueChange={(v) => onUpdate('gender', v)} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="font-normal">{strings.genderMale}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="font-normal">{strings.genderFemale}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="font-normal">{strings.genderNone}</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">住所・連絡先</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={strings.postalCodeLabel}
                value={data.postalCode}
                onChange={(e) => onUpdate('postalCode', e.target.value)}
                onBlur={(e) => onUpdate('postalCode', formatPostal(e.target.value))}
                error={errors.postalCode}
                placeholder="123-4567"
                inputMode="numeric"
              />
              <div className="space-y-1.5">
                <Label>{strings.prefectureLabel}</Label>
                <Select value={data.prefecture} onValueChange={(v) => onUpdate('prefecture', v)}>
                  <SelectTrigger className={errors.prefecture ? 'border-destructive' : ''}>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREFECTURES.map(p => (
                      <SelectItem key={p.kanji} value={p.kanji}>{p.kanji}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.prefecture && <p className="text-xs text-destructive">{errors.prefecture}</p>}
              </div>
            </div>
            <FormField
              label={strings.addressLabel}
              value={data.address}
              onChange={(e) => onUpdate('address', e.target.value)}
              error={errors.address}
              placeholder="渋谷区神宮前1-2-3"
            />
            <FormField
              label={strings.addressFuriganaLabel}
              value={data.addressFurigana}
              onChange={(e) => onUpdate('addressFurigana', e.target.value)}
              placeholder="しぶやくじんぐまえ"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={strings.phoneLabel}
                value={data.phone}
                onChange={(e) => onUpdate('phone', e.target.value)}
                error={errors.phone}
                placeholder="090-1234-5678"
                inputMode="numeric"
              />
              <FormField
                label={strings.emailLabel}
                type="email"
                value={data.email}
                onChange={(e) => onUpdate('email', e.target.value)}
                error={errors.email}
                placeholder="example@email.com"
                inputMode="email"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="alternate"
                checked={data.alternateContactEnabled}
                onCheckedChange={(v) => onUpdate('alternateContactEnabled', v)}
              />
              <Label htmlFor="alternate" className="text-sm">{strings.alternateContactLabel}</Label>
            </div>
            {data.alternateContactEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6 border-l-2 border-muted">
                <FormField
                  label="続柄"
                  value={data.alternateContact?.relation || ''}
                  onChange={(e) => onUpdate('alternateContact', { ...data.alternateContact, relation: e.target.value })}
                  placeholder="父"
                />
                <FormField
                  label="名前"
                  value={data.alternateContact?.name || ''}
                  onChange={(e) => onUpdate('alternateContact', { ...data.alternateContact, name: e.target.value })}
                  placeholder="田中 太郎"
                />
                <FormField
                  label="電話番号"
                  value={data.alternateContact?.phone || ''}
                  onChange={(e) => onUpdate('alternateContact', { ...data.alternateContact, phone: e.target.value })}
                  placeholder="03-1234-5678"
                  inputMode="numeric"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
