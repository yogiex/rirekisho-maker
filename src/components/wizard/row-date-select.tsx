import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';

import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { RirekishoData } from '@/lib/schema/rirekisho-schema';

interface RowDateSelectProps {
  name: FieldPath<RirekishoData>;
  unit: 'year' | 'month' | 'day';
  label: string;
  options: readonly number[];
}

export function RowDateSelect({ name, unit, label, options }: RowDateSelectProps) {
  const { control } = useFormContext<RirekishoData>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs text-muted-foreground">{label}</FormLabel>
          <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
            <FormControl>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-64">
              {options.map((n) => (
                <SelectItem key={n} value={String(n)} className="tabular-nums">
                  {unit === 'year' ? n : unit === 'month' ? `${n}月` : `${n}日`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
