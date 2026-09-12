import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { saveDraft, updateLastStep } from '@/lib/storage/draft';
import { rirekishoSchema, type RirekishoData } from '@/lib/schema/rirekisho-schema';
import { strings } from '@/lib/constants/strings';

const DEBOUNCE_MS = 800;

/**
 * Hydration gate: MUST stay idle until `armed` — otherwise the first
 * watch-fire (default values) can overwrite the stored draft. THE classic
 * data-loss bug this app must never ship (RULES §7).
 */
export function useDraftAutosave(form: UseFormReturn<RirekishoData>, armed: boolean, step: number) {
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
    if (!armed) return;
    updateLastStep(step);
  }, [step, armed]);

  useEffect(() => {
    if (!armed) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const subscription = form.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const result = rirekishoSchema.safeParse(values);
        if (!result.success) return;
        const err = saveDraft(result.data, stepRef.current);
        if (err === 'QUOTA_EXCEEDED') {
          toast.error(strings.photo.errorFailed);
          return;
        }
        const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setSavedLabel(`${strings.trust.autosave} • ${time}`);
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [form, armed]);

  return savedLabel;
}
