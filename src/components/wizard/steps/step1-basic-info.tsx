import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { PhotoUpload } from '@/components/wizard/photo-upload';

import { FormFieldDeep, SelectFieldFree } from '@/components/wizard/form-primitives';
import { useDraftForm } from '@/components/wizard/hooks/use-draft-form';
import { strings } from '@/lib/constants/strings';
import { PREFECTURES } from '@/lib/constants/prefectures';
import { GENDER_VALUES, type Gender } from '@/lib/schema/rirekisho-schema';
import { formatPostal, normalizeWidth } from '@/lib/utils/normalize';
import { getWareki } from '@/lib/utils/wareki';
import { getFullAge } from '@/lib/utils/age';
import { Controller } from 'react-hook-form';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1900 + 1 }, (_, i) => CURRENT_YEAR - i);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);

const GENDER_LABEL: Record<Gender, string> = {
  male: strings.step1.genderMale,
  female: strings.step1.genderFemale,
  none: strings.step1.genderNone,
};

interface Step1Props {
  onNext: () => void;
}

export function Step1BasicInfo({ onNext }: Step1Props) {
  const form = useDraftForm();
  const dob = form.watch('dateOfBirth');
  const altEnabled = form.watch('alternateContactEnabled');
  const wareki = getWareki(dob);
  const age = getFullAge(dob, new Date());

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:sticky md:top-24 md:self-start">
            <PhotoUpload />
          </div>

          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardContent className="flex items-start gap-2 p-3 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span>
                  <strong className="font-medium text-foreground">
                    {strings.trust.sharedComputerTitle}
                  </strong>{' '}
                  {strings.trust.sharedComputer}
                </span>
              </CardContent>
            </Card>

            <div className="grid gap-5 md:grid-cols-2">
              <FormFieldDeep
                name="furigana"
                label={strings.step1.furigana}
                tip={strings.tips.furigana}
                render={(field) => (
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    placeholder="さんとそ"
                    className="h-9"
                  />
                )}
              />
              <FormFieldDeep
                name="fullName"
                label={strings.step1.fullName}
                tip={strings.tips.fullName}
                render={(field) => (
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    placeholder="ブディ・サントソ"
                    className="h-9"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label className="text-sm font-medium">{strings.step1.dob}</Label>
                {wareki && (
                  <span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground tabular-nums">
                    {wareki.label}
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {strings.step1.age}: 満{age}歳
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Select value={String(dob.year)} onValueChange={(v) => form.setValue('dateOfBirth', { ...dob, year: Number(v) }, { shouldValidate: true })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder={strings.step1.dobYear} /></SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={String(dob.month)} onValueChange={(v) => form.setValue('dateOfBirth', { ...dob, month: Number(v) }, { shouldValidate: true })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder={strings.step1.dobMonth} /></SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map((m) => <SelectItem key={m} value={String(m)}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={String(dob.day)} onValueChange={(v) => form.setValue('dateOfBirth', { ...dob, day: Number(v) }, { shouldValidate: true })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder={strings.step1.dobDay} /></SelectTrigger>
                  <SelectContent>
                    {DAY_OPTIONS.map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{strings.step1.gender}</Label>
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4">
                    {GENDER_VALUES.map((v) => (
                      <div key={v} className="flex items-center gap-2">
                        <RadioGroupItem value={v} id={v} />
                        <Label htmlFor={v} className="font-normal">{GENDER_LABEL[v]}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="postalCode" className="text-sm font-medium">
                  {strings.step1.postal} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="postalCode"
                  {...form.register('postalCode', {
                    onBlur: (e) => {
                      form.setValue('postalCode', formatPostal(e.target.value), { shouldValidate: true });
                    },
                  })}
                  inputMode="numeric"
                  placeholder="123-4567"
                  className="h-9 tabular-nums"
                />
                <FormMessage />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prefecture" className="text-sm font-medium">
                  {strings.step1.prefecture} <span className="text-destructive">*</span>
                </Label>
                <SelectFieldFree
                  name="prefecture"
                  placeholder={strings.step1.prefecturePlaceholder}
                  value={form.watch('prefecture')}
                  onChange={(v) => form.setValue('prefecture', v, { shouldValidate: true })}
                  options={PREFECTURES}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  {strings.step1.address} <span className="text-destructive">*</span>
                </Label>
                <Input id="address" {...form.register('address')} className="h-9" placeholder="東京都新宿区…" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="addressFurigana" className="text-sm font-medium">
                  {strings.step1.addressFurigana}
                </Label>
                <Input id="addressFurigana" {...form.register('addressFurigana')} className="h-9" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">{strings.step1.phone}</Label>
                <Input
                  id="phone"
                  {...form.register('phone', {
                    onBlur: (e) =>
                      form.setValue('phone', normalizeWidth(e.target.value).trim(), { shouldValidate: true }),
                  })}
                  inputMode="tel"
                  className="h-9 tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">{strings.step1.email}</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  {...form.register('email', {
                    onBlur: (e) =>
                      form.setValue('email', normalizeWidth(e.target.value).trim(), { shouldValidate: true }),
                  })}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-md border p-4">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="altEnabled" className="text-sm font-medium">
                  {strings.step1.altToggle}
                </Label>
                <Switch
                  id="altEnabled"
                  checked={altEnabled}
                  onCheckedChange={(checked) => form.setValue('alternateContactEnabled', checked, { shouldValidate: true })}
                />
              </div>
              {altEnabled && (
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="altRelation" className="text-sm font-medium">
                      {strings.step1.altRelation} <span className="text-destructive">*</span>
                    </Label>
                    <Input id="altRelation" {...form.register('alternateContact.relation')} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="altName" className="text-sm font-medium">
                      {strings.step1.altName} <span className="text-destructive">*</span>
                    </Label>
                    <Input id="altName" {...form.register('alternateContact.name')} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="altPhone" className="text-sm font-medium">
                      {strings.step1.altPhone} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="altPhone"
                      inputMode="tel"
                      {...form.register('alternateContact.phone', {
                        onBlur: (e) =>
                          form.setValue('alternateContact.phone', normalizeWidth(e.target.value).trim(), {
                            shouldValidate: true,
                          }),
                      })}
                      className="h-9 tabular-nums"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {strings.nav.next}
          </button>
        </div>
      </form>
    </Form>
  );
}
