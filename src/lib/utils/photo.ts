export async function processPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });

  const targetRatio = 3 / 4;
  const sourceRatio = bitmap.width / bitmap.height;

  let sx: number, sy: number, sw: number, sh: number;
  if (sourceRatio > targetRatio) {
    sh = bitmap.height;
    sw = sh * targetRatio;
    sx = (bitmap.width - sw) / 2;
    sy = 0;
  } else {
    sw = bitmap.width;
    sh = sw / targetRatio;
    sx = 0;
    sy = (bitmap.height - sh) / 2;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, 600, 800);

  return new Promise((resolve) => {
    const attempt = (q: number) => {
      canvas.toBlob((blob) => {
        if (!blob) { resolve(''); return; }
        if (blob.size > 500 * 1024 && q > 0.3) {
          attempt(q - 0.15);
        } else {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        }
      }, 'image/jpeg', q);
    };
    attempt(0.85);
  });
}
