import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldTip } from '@/components/wizard/field-tip';
import { strings } from '@/lib/constants/strings';
import { processPhotoFile, type PhotoErrorReason } from '@/lib/utils/photo';

type PhotoUiState =
  | { status: 'idle' }
  | { status: 'processing' }
  | { status: 'error'; reason: PhotoErrorReason };

const ERROR_TOAST: Record<PhotoErrorReason, string> = {
  NOT_IMAGE: strings.photo.errorNotImage,
  TOO_LARGE: strings.photo.errorTooLarge,
  PROCESSING_FAILED: strings.photo.errorFailed,
};

export function PhotoUpload() {
  const form = useFormContext();
  const photo = form.watch('photo');
  const inputRef = useRef<HTMLInputElement>(null);
  const [ui, setUi] = useState<PhotoUiState>({ status: 'idle' });

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUi({ status: 'processing' });
    const result = await processPhotoFile(file);
    if (result.ok) {
      form.setValue('photo', result.dataUrl, { shouldValidate: true, shouldDirty: true });
      setUi({ status: 'idle' });
    } else {
      setUi({ status: 'error', reason: result.reason });
      toast.error(ERROR_TOAST[result.reason]);
    }
  }

  function handleRemove(): void {
    form.setValue('photo', undefined, { shouldValidate: true, shouldDirty: true });
    setUi({ status: 'idle' });
  }

  const processing = ui.status === 'processing';

  return (
    <Card className={processing ? 'opacity-60' : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-base">
          {strings.step1.photoHeading}
          <FieldTip text={strings.tips.photo} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          aria-label={strings.step1.photoHeading}
          className="relative grid aspect-3/4 w-full max-w-45 place-items-center overflow-hidden rounded-md border border-dashed bg-stone-100"
        >
          {photo ? (
            <img src={photo} alt="Foto profil" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-muted-foreground">
              {strings.photo.placeholder}
              <span className="mt-1 block text-xs">{strings.photo.hint}</span>
            </span>
          )}
          {processing && (
            <span className="absolute inset-0 grid place-items-center bg-background/70">
              <span className="flex items-center gap-2 text-xs">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {strings.photo.processing}
              </span>
            </span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          aria-hidden
          tabIndex={-1}
        />
        {photo && (
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              {strings.photo.change}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
              {strings.photo.remove}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
