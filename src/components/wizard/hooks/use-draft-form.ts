import { useContext } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { DraftFormContext } from '../draft-form-context';
import type { RirekishoData } from '@/lib/schema/rirekisho-schema';

export function useDraftForm(): UseFormReturn<RirekishoData> {
  const form = useContext(DraftFormContext);
  if (!form) throw new Error('useDraftForm must be used inside WizardShell');
  return form;
}
