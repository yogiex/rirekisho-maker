'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { createSampleDraft } from '@/lib/constants/sample-draft';
import { strings } from '@/lib/constants/strings';
import type { RirekishoData } from '@/lib/schema/rirekisho-schema';
import { isDraftEmpty } from '@/lib/utils/draft-state';

interface SampleDataButtonProps {
  variant?: 'default' | 'outline';
}

export function SampleDataButton({ variant = 'default' }: SampleDataButtonProps) {
  const form = useFormContext<RirekishoData>();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function applySample(): void {
    form.reset(createSampleDraft(new Date()));
    setConfirmOpen(false);
    toast.info(strings.sample.loaded);
  }

  function handleLoad(): void {
    if (isDraftEmpty(form.getValues())) {
      applySample();
      return;
    }
    setConfirmOpen(true);
  }

  return (
    <>
      <Button type="button" variant={variant} onClick={handleLoad}>
        <Sparkles className="size-4" aria-hidden />
        {variant === 'outline' ? strings.sample.sidebarButton : strings.sample.ctaButton}
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{strings.sample.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{strings.sample.confirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{strings.sample.confirmCancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={applySample}
            >
              {strings.sample.confirmOk}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
