import { useState } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { ListOrdered, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { FieldTip } from '@/components/wizard/field-tip';
import { ConfirmDeleteDialog } from '@/components/wizard/confirm-delete-dialog';
import { RowDateSelect } from '@/components/wizard/row-date-select';
import { useDraftForm } from '@/components/wizard/hooks/use-draft-form';
import { strings } from '@/lib/constants/strings';
import { MONTH_OPTIONS, YEAR_OPTIONS } from '@/lib/constants/date-options';
import type { HistoryAction, HistoryCategory, RirekishoData } from '@/lib/schema/rirekisho-schema';
import {
  ACTION_OPTIONS, createEmptyHistoryEntry, defaultActionFor,
  findOutOfOrderRows, hasRowContent,
} from '@/lib/utils/history';

type P = FieldPath<RirekishoData>;

interface Step2HistoryProps {
  onNext: () => void;
}

export function Step2History({ onNext }: Step2HistoryProps) {
  const form = useDraftForm();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'history' });
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  function handleAdd(category: HistoryCategory): void {
    append(createEmptyHistoryEntry(category, new Date()));
  }

  function confirmRemove(): void {
    if (pendingDelete !== null) remove(pendingDelete);
    setPendingDelete(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const rows = findOutOfOrderRows(form.getValues('history'));
    if (rows.length > 0) {
      toast.warning(strings.step2.chronologyWarning(rows.join(', ')));
    }
    onNext();
  }

  function requestRemove(index: number): void {
    const entry = form.getValues('history')[index] as { name: string; nameFurigana?: string; detail?: string } | undefined;
    if (entry && hasRowContent(entry)) setPendingDelete(index);
    else remove(index);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          {strings.steps[1].id}
          <FieldTip text={strings.tips.historyStart} />
        </p>
        <p className="text-xs text-muted-foreground">{strings.step2.furiganaHint}</p>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md bg-muted p-8 text-center">
          <ListOrdered className="size-10 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium">{strings.step2.emptyTitle}</p>
          <p className="text-xs text-muted-foreground">{strings.step2.emptyDesc}</p>
          <AddButtons onAdd={handleAdd} />
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <HistoryRow
              key={field.id}
              index={index}
              onRequestRemove={() => requestRemove(index)}
            />
          ))}
          <AddButtons onAdd={handleAdd} />
        </div>
      )}

      <Controller
        control={form.control}
        name="historyCurrent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
              />
            </FormControl>
            <FormLabel className="text-sm font-normal">{strings.step2.historyCurrent}</FormLabel>
          </FormItem>
        )}
      />

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => { if (!o) setPendingDelete(null); }}
        onConfirm={confirmRemove}
      />
    </form>
  );
}

interface HistoryRowProps {
  index: number;
  onRequestRemove: () => void;
}

function HistoryRow({ index, onRequestRemove }: HistoryRowProps) {
  const { control, setValue, getValues } = useFormContext<RirekishoData>();
  const category = useWatch({ control, name: `history.${index}.category` as P });
  const cat = (category ?? 'education') as HistoryCategory;
  const actions = ACTION_OPTIONS[cat];
  const isEdu = cat === 'education';

  return (
    <Card className="relative p-4 pr-12">
      <CardContent className="space-y-4 p-0">
        <span className="absolute left-3 top-4 text-xs font-medium text-muted-foreground tabular-nums">
          {index + 1}.
        </span>

        <div className="grid grid-cols-2 gap-3 pl-6 md:grid-cols-4">
          <RowDateSelect name={`history.${index}.date.year` as P} unit="year" label={strings.step2.dateYear} options={YEAR_OPTIONS} />
          <RowDateSelect name={`history.${index}.date.month` as P} unit="month" label={strings.step2.dateMonth} options={MONTH_OPTIONS} />

          <Controller
            control={control}
            name={`history.${index}.category` as P}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">{strings.step2.categoryLabel}</FormLabel>
                <Select
                  value={field.value as string}
                  onValueChange={(v) => {
                    field.onChange(v);
                    const actionPath = `history.${index}.action` as P;
                    const currentAction = getValues(actionPath) as string | undefined;
                    if (currentAction && !ACTION_OPTIONS[v as HistoryCategory].includes(currentAction as HistoryAction)) {
                      setValue(actionPath, defaultActionFor(v as HistoryCategory), { shouldValidate: true });
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="education">{strings.step2.categoryEducation}</SelectItem>
                    <SelectItem value="work">{strings.step2.categoryWork}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={control}
            name={`history.${index}.action` as P}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">{strings.step2.actionLabel}</FormLabel>
                <Select value={field.value as string} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {actions.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3 pl-6 md:grid-cols-2">
          <Controller
            control={control}
            name={`history.${index}.name` as P}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">{strings.step2.nameLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value as string}
                    className="h-9"
                    placeholder={isEdu ? strings.step2.namePlaceholderEdu : strings.step2.namePlaceholderWork}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name={`history.${index}.nameFurigana` as P}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">{strings.step2.furiganaLabel}</FormLabel>
                <FormControl>
                  <Input {...field} value={(field.value as string) ?? ''} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Controller
          control={control}
          name={`history.${index}.detail` as P}
          render={({ field }) => (
            <FormItem className="pl-6">
              <FormLabel className="text-xs text-muted-foreground">{strings.step2.detailLabel}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={(field.value as string) ?? ''}
                  className="h-9"
                  placeholder={isEdu ? strings.step2.detailPlaceholderEdu : strings.step2.detailPlaceholderWork}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

function AddButtons({ onAdd }: { onAdd: (c: HistoryCategory) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={() => onAdd('education')}>
        <Plus className="size-4" aria-hidden />
        {strings.step2.addEducation}
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => onAdd('work')}>
        <Plus className="size-4" aria-hidden />
        {strings.step2.addWork}
      </Button>
    </div>
  );
}
