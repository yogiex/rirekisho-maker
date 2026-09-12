'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  htmlFor?: string;
}

export function FormField({ label, error, hint, htmlFor, className, ...props }: FormFieldProps) {
  const generatedId = React.useId();
  const id = htmlFor || generatedId;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {hint && <span className="ml-1 text-xs text-muted-foreground">{hint}</span>}
      </Label>
      <input
        id={id}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
