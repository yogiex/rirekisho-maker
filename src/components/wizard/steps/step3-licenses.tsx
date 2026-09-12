import { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { Award, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ConfirmDeleteDialog } from '@/components/wizard/confirm-delete-dialog';
import { RowDateSelect } from '@/components/wizard/row-date-select';
import { useDraftForm } from '@/components/wizard/hooks/use-draft-form';
import { strings } from '@/lib/constants/strings';
import { MONTH_OPTIONS, YEAR_OPTIONS } from '@/lib/constants/date-options';
import type { RirekishoData } from '@/lib/schema/rirekisho-schema';
import { createEmptyLicenseEntry, hasLicenseContent } from '@/lib/utils/licenses';

type P = FieldPath<RirekishoData>;

interface Step3LicensesProps {
  onNext: () => void;
}

export function Step3Licenses({ onNext }: Step3LicensesProps) {
  const form = useDraftForm();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'licenses' });
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  function addRow(): void {
    append(createEmptyLicenseEntry(new Date()));
  }

  function confirmRemove(): void {
    if (pendingDelete !== null) remove(pendingDelete);
    setPendingDelete(null);
  }

  function requestRemove(index: number): void {
    const entry = form.getValues(`licenses.${index}`);
    if (entry && hasLicenseContent(entry)) setPendingDelete(index);
    else remove(index);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-medium">{strings.steps[2].id}</p>
        <p className="text-xs text-muted-foreground">{strings.step3.hint}</p>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md bg-muted p-8 text-center">
          <Award className="size-10 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium">{strings.step3.emptyTitle}</p>
          <p className="text-xs text-muted-foreground">{strings.step3.emptyDesc}</p>
          <AddButton onAdd={addRow} />
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <LicenseRow
              key={field.id}
              index={index}
              onRequestRemove={() => requestRemove(index)}
            />
          ))}
          <AddButton onAdd={addRow} />
        </div>
      )}

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => { if (!o) setPendingDelete(null); }}
        onConfirm={confirmRemove}
      />
    </form>
  );
}

interface LicenseRowProps {
  index: number;
  onRequestRemove: () => void;
}

function LicenseRow({ index, onRequestRemove }: LicenseRowProps) {
  const { control } = useFormContext<RirekishoData>();

  return (
    <Card className="relative p-4 pr-12">
      <CardContent className="space-y-4 p-0">
        <div className="grid grid-cols-2 gap-3 md:max-w-md">
          <RowDateSelect
            name={`licenses.${index}.date.year` as P}
            unit="year"
            label={strings.step3.dateYear}
            options={YEAR_OPTIONS}
          />
          <RowDateSelect
            name={`licenses.${index}.date.month` as P}
            unit="month"
            label={strings.step3.dateMonth}
            options={MONTH_OPTIONS}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Controller
            control={control}
            name={`licenses.${index}.name` as P}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">{strings.step3.nameLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={(field.value as string) ?? ''}
                    className="h-9"
                    placeholder={strings.step3.namePlaceholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name={`licenses.${index}.issuer` as P}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">{strings.step3.issuerLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={(field.value as string) ?? ''}
                    className="h-9"
                    placeholder={strings.step3.issuerPlaceholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>

      <button
        type="button"
        aria-label={strings.common.deleteAria}
        onClick={onRequestRemove}
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </Card>
  );
}

function AddButton({ onAdd }: { onAdd: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onAdd}>
      <Plus className="size-4" aria-hidden />
      {strings.step3.add}
    </Button>
  );
}
