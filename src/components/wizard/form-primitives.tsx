import { useFormContext, Controller } from 'react-hook-form';
import type { ReactNode } from 'react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldTip } from '@/components/wizard/field-tip';
import type { PrefectureOption } from '@/lib/constants/prefectures';

interface Option { value: string; label: string }

interface FormFieldDeepProps {
  name: string;
  label: string;
  tip?: string;
  required?: boolean;
  render: (field: { value: string; onChange: (v: string) => void; onBlur: () => void; name: string }) => ReactNode;
}

export function FormFieldDeep({ name, label, tip, required, render }: FormFieldDeepProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem data-field={name}>
          <FormLabel className="text-sm font-medium">
            {label} {required && <span className="text-destructive">*</span>}
            {tip && <FieldTip text={tip} />}
          </FormLabel>
          <FormControl>
            {render({
              value: String(field.value ?? ''),
              onChange: (v: string) => field.onChange(v),
              onBlur: field.onBlur,
              name: field.name,
            })}
          </FormControl>
          {fieldState.error?.message && <FormMessage error={fieldState.error.message} />}
        </FormItem>
      )}
    />
  );
}

interface SelectFieldFreeProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly Option[] | readonly PrefectureOption[];
}

export function SelectFieldFree({ name, placeholder, value, onChange, options }: SelectFieldFreeProps) {
  return (
    <div data-field={name}>
      <Select value={value} onValueChange={(v) => onChange(v as string)}>
        <SelectTrigger className="h-9 w-full" aria-label={placeholder}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
