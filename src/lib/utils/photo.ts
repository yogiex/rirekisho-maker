export type PhotoErrorReason = 'NOT_IMAGE' | 'TOO_LARGE' | 'PROCESSING_FAILED';

export type PhotoProcessResult =
  | { ok: true; dataUrl: string }
  | { ok: false; reason: PhotoErrorReason };

const TARGET_W = 600;
const TARGET_H = 800;
const MAX_RAW_BYTES = 10 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 500 * 1024;
const QUALITY_LADDER = [0.85, 0.75, 0.6, 0.45];

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('read'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Center-crop cover 3:4 → 600×800 → JPEG re-encode.
 * Canvas re-encode DISCARDS ALL EXIF including GPS (SEC-06) — never shortcut
 * by base64-ing the original file.
 */
export async function processPhotoFile(file: File): Promise<PhotoProcessResult> {
  if (!file.type.startsWith('image/')) return { ok: false, reason: 'NOT_IMAGE' };
  if (file.size > MAX_RAW_BYTES) return { ok: false, reason: 'TOO_LARGE' };

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return { ok: false, reason: 'PROCESSING_FAILED' };
  }

  const canvas = document.createElement('canvas');
  canvas.width = TARGET_W;
  canvas.height = TARGET_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return { ok: false, reason: 'PROCESSING_FAILED' };
  }

  const srcRatio = bitmap.width / bitmap.height;
  const targetRatio = TARGET_W / TARGET_H;
  let sx = 0;
  let sy = 0;
  let sw = bitmap.width;
  let sh = bitmap.height;
  if (srcRatio > targetRatio) {
    sw = bitmap.height * targetRatio;
    sx = (bitmap.width - sw) / 2;
  } else {
    sh = bitmap.width / targetRatio;
    sy = (bitmap.height - sh) / 2;
  }
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);
  bitmap.close();

  for (const quality of QUALITY_LADDER) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    );
    if (blob && blob.size <= MAX_OUTPUT_BYTES) {
      try {
        return { ok: true, dataUrl: await blobToDataUrl(blob) };
      } catch {
        return { ok: false, reason: 'PROCESSING_FAILED' };
      }
    }
  }
  return { ok: false, reason: 'PROCESSING_FAILED' };
}
