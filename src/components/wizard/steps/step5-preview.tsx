'use client';

import { useRef, useState } from 'react';
import { Download, Loader2, Printer, RotateCcw, Upload } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PaperScaler } from '@/components/preview/paper-scaler';
import { RirekishoPaper } from '@/components/preview/rirekisho-paper';
import { RowDateSelect } from '@/components/wizard/row-date-select';
import { SampleDataButton } from '@/components/wizard/sample-data-button';
import { useDraftForm } from '@/components/wizard/hooks/use-draft-form';
import { DAY_OPTIONS, MONTH_OPTIONS, YEAR_OPTIONS } from '@/lib/constants/date-options';
import { strings } from '@/lib/constants/strings';
import { createDefaultDraft } from '@/lib/schema/rirekisho-schema';
import { clearAllDraftData, exportDraftToJson } from '@/lib/storage/draft';
import { importDraftFile, type ImportFailureReason } from '@/lib/storage/import';
import { buildExportFilename } from '@/lib/utils/paper';

interface Step5Props {
  onRestart: () => void;
}

const importErrorMessages: Record<ImportFailureReason, string> = {
  FILE_TOO_LARGE: strings.step5.importTooLarge,
  INVALID_JSON: strings.step5.importInvalid,
  VERSION_MISMATCH: strings.step5.importVersion,
  INVALID_FIELDS: strings.step5.importInvalidFields,
};

export function Step5Preview({ onRestart }: Step5Props) {
  const form = useDraftForm();
  const data = form.watch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  function handlePrint(): void {
    window.print();
  }

  function handleExport(): void {
    const blob = new Blob([exportDraftToJson(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = buildExportFilename(new Date());
    a.click();
    URL.revokeObjectURL(url);
    toast.success(strings.step5.exportDone, { description: strings.trust.exportPiiWarning });
  }

  async function handleImportChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImporting(true);
    try {
      const result = await importDraftFile(file);
      if (!result.ok) {
        toast.error(importErrorMessages[result.reason]);
        return;
      }
      form.reset(result.data);
      window.scrollTo({ top: 0 });
      toast.success(strings.step5.importDone);
    } finally {
      setImporting(false);
    }
  }

  function handleResetConfirm(): void {
    clearAllDraftData();
    form.reset(createDefaultDraft(new Date()));
    setResetOpen(false);
    onRestart();
    toast.success(strings.trust.resetDone);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-md bg-muted p-4">
        <PaperScaler>
          <RirekishoPaper data={data} />
        </PaperScaler>
      </div>

      <Card className="h-fit space-y-4 p-4 lg:sticky lg:top-24">
        <div className="grid grid-cols-3 gap-2">
          <RowDateSelect name="fillDate.year" unit="year" label={strings.step5.fillYear} options={YEAR_OPTIONS} />
          <RowDateSelect name="fillDate.month" unit="month" label={strings.step5.fillMonth} options={MONTH_OPTIONS} />
          <RowDateSelect name="fillDate.day" unit="day" label={strings.step5.fillDay} options={DAY_OPTIONS} />
        </div>

        <div className="space-y-2">
          <Button type="button" className="w-full" onClick={handlePrint}>
            <Printer className="size-4" aria-hidden />
            {strings.step5.print}
          </Button>
          <p className="text-xs text-muted-foreground">{strings.step5.printHint}</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <Button type="button" variant="outline" className="w-full" onClick={handleExport}>
            <Download className="size-4" aria-hidden />
            {strings.step5.exportJson}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            {importing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
            {importing ? strings.step5.importing : strings.step5.importJson}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportChange}
          />
          <div className="flex">
            <SampleDataButton variant="outline" />
          </div>
        </div>

        <Separator />

        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={() => setResetOpen(true)}
        >
          <RotateCcw className="size-4" aria-hidden />
          {strings.step5.reset}
        </Button>
      </Card>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{strings.trust.resetTitle}</AlertDialogTitle>
            <AlertDialogDescription>{strings.trust.resetDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{strings.trust.resetCancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleResetConfirm}
            >
              {strings.trust.resetConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
