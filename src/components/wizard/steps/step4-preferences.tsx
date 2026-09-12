import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { CharacterCounter } from '@/components/wizard/character-counter';
import { FieldTip } from '@/components/wizard/field-tip';
import { useDraftForm } from '@/components/wizard/hooks/use-draft-form';
import { strings } from '@/lib/constants/strings';
import { MOTIVATION_MAX, REQUESTS_MAX, type RirekishoData } from '@/lib/schema/rirekisho-schema';
import { resolveInsertion } from '@/lib/utils/insertion';

const HOUR_OPTIONS = [0, 1, 2, 3] as const;
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => i * 5);
const DEPENDENT_OPTIONS = Array.from({ length: 21 }, (_, i) => i);

interface Step4PreferencesProps {
  onNext: () => void;
}

export function Step4Preferences({ onNext }: Step4PreferencesProps) {
  const form = useDraftForm();
  const [insertConfirmOpen, setInsertConfirmOpen] = useState(false);
  const motivation = form.watch('motivation');
  const requests = form.watch('requests');

  function applyInsert(): void {
    form.setValue('motivation', strings.examples.motivation, { shouldValidate: true, shouldDirty: true });
    setInsertConfirmOpen(false);
    toast.info(strings.examples.insertedToast);
  }

  function requestInsertExample(): void {
    const { needsConfirm } = resolveInsertion(form.getValues('motivation'), strings.examples.motivation);
    if (needsConfirm) setInsertConfirmOpen(true);
    else applyInsert();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-sm font-medium">{strings.steps[3].id}</p>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField name="specialties" label={strings.step4.specialties} placeholder={strings.step4.specialtiesPlaceholder} />
        <TextField name="hobbies" label={strings.step4.hobbies} placeholder={strings.step4.hobbiesPlaceholder} />
      </div>

      <Controller
        control={form.control}
        name="motivation"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <FormLabel htmlFor="motivation">{strings.step4.motivation}</FormLabel>
                <FieldTip text={strings.tips.motivation} />
              </div>
              <CharacterCounter value={motivation ?? ''} max={MOTIVATION_MAX} />
            </div>
            <FormControl>
              <Textarea
                {...field}
                id="motivation"
                className="max-w-3xl"
                value={field.value ?? ''}
                rows={8}
                placeholder={strings.step4.motivationPlaceholder}
                aria-invalid={!!fieldState.error}
              />
            </FormControl>
            <FormMessage error={fieldState.error?.message} />
            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={requestInsertExample}>
                {strings.step4.insertExample}
              </Button>
            </div>
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">{strings.step4.commute}</p>
        <div className="grid max-w-sm grid-cols-2 gap-3">
          <NumberSelect
            name="commuteHours"
            label={strings.step4.commuteHourLabel}
            options={HOUR_OPTIONS}
            format={(n) => `${n}時間`}
          />
          <NumberSelect
            name="commuteMinutes"
            label={strings.step4.commuteMinuteLabel}
            options={MINUTE_OPTIONS}
            format={(n) => `${n}分`}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Controller
          control={form.control}
          name="spouse"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{strings.step4.spouse}</FormLabel>
              <RadioGroup
                value={String(field.value)}
                onValueChange={(v) => field.onChange(v === 'true')}
                className="flex gap-6 pt-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="spouse-yes" value="true" />
                  <Label htmlFor="spouse-yes" className="font-normal">{strings.step4.spouseYes}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="spouse-no" value="false" />
                  <Label htmlFor="spouse-no" className="font-normal">{strings.step4.spouseNo}</Label>
                </div>
              </RadioGroup>
              <FormMessage error={fieldState.error?.message} />
            </FormItem>
          )}
        />
        <NumberSelect
          name="dependents"
          label={strings.step4.dependents}
          options={DEPENDENT_OPTIONS}
          format={(n) => `${n}人`}
          labelClassName="text-sm font-medium"
        />
      </div>

      <Controller
        control={form.control}
        name="requests"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between gap-2">
              <FormLabel htmlFor="requests">{strings.step4.requests}</FormLabel>
              <CharacterCounter value={requests ?? ''} max={REQUESTS_MAX} />
            </div>
            <FormControl>
              <Textarea
                {...field}
                id="requests"
                className="max-w-3xl"
                value={field.value ?? ''}
                rows={4}
                placeholder={strings.step4.requestsPlaceholder}
                aria-invalid={!!fieldState.error}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">{strings.step4.requestsHint}</p>
            <FormMessage error={fieldState.error?.message} />
          </FormItem>
        )}
      />

      <AlertDialog open={insertConfirmOpen} onOpenChange={setInsertConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{strings.step4.insertConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{strings.step4.insertConfirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{strings.step4.insertConfirmCancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={applyInsert}
            >
              {strings.step4.insertConfirmOk}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

interface TextFieldProps {
  name: Extract<FieldPath<RirekishoData>, 'specialties' | 'hobbies'>;
  label: string;
  placeholder: string;
}

function TextField({ name, label, placeholder }: TextFieldProps) {
  const { control } = useFormContext<RirekishoData>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              id={name}
              value={field.value ?? ''}
              className="h-9"
              placeholder={placeholder}
              aria-invalid={!!fieldState.error}
            />
          </FormControl>
          <FormMessage error={fieldState.error?.message} />
        </FormItem>
      )}
    />
  );
}

interface NumberSelectProps {
  name: Extract<FieldPath<RirekishoData>, 'commuteHours' | 'commuteMinutes' | 'dependents'>;
  label: string;
  options: readonly number[];
  format: (n: number) => string;
  labelClassName?: string;
}

function NumberSelect({ name, label, options, format, labelClassName }: NumberSelectProps) {
  const { control } = useFormContext<RirekishoData>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className={labelClassName ?? 'text-xs text-muted-foreground'}>{label}</FormLabel>
          <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
            <FormControl>
              <SelectTrigger className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-64">
              {options.map((n) => (
                <SelectItem key={n} value={String(n)} className="tabular-nums">
                  {format(n)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage error={fieldState.error?.message} />
        </FormItem>
      )}
    />
  );
}
