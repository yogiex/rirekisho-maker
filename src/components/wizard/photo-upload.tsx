'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { processPhoto } from '@/lib/utils/photo';
import { strings } from '@/lib/constants/strings';

interface PhotoUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(strings.photoInvalidType);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert(strings.photoMaxSize);
      return;
    }

    setIsProcessing(true);
    try {
      const dataUrl = await processPhoto(file);
      onChange(dataUrl);
    } catch {
      alert('写真の処理に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="aspect-[3/4] relative overflow-hidden rounded-md border border-dashed border-border bg-muted/50">
        {value ? (
          <img src={value} alt="証明写真" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Camera className="h-10 w-10 mb-2" />
            <span className="text-xs">{strings.photoPlaceholder}</span>
          </div>
        )}
        {isProcessing && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-xs">{strings.photoProcessing}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          {strings.photoChange}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(undefined)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </Card>
  );
}
