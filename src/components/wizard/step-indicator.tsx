import { Check } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { strings } from '@/lib/constants/strings';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  current: number;
  maxReached: number;
  onSelect: (step: number) => void;
}

export function StepIndicator({ current, maxReached, onSelect }: StepIndicatorProps) {
  const total = strings.steps.length;
  const currentMeta = strings.steps[current - 1];

  return (
    <>
      <ol className="mb-8 hidden items-start md:flex" aria-label="Langkah wizard">
        {strings.steps.map((meta, i) => {
          const n = i + 1;
          const isDone = n < current;
          const isCurrent = n === current;
          const isReachable = n <= maxReached && !isCurrent;

          const nodeClass = cn(
            'flex size-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors',
            isDone && 'border-primary bg-primary text-primary-foreground',
            isCurrent && 'border-primary bg-background text-primary',
            !isDone && !isCurrent && 'border-transparent bg-muted text-muted-foreground',
            isReachable && 'hover:border-primary/50',
          );
          const content = isDone ? <Check className="size-4" aria-hidden /> : n;

          return (
            <li key={meta.jp} className={cn('flex items-start', n < total && 'flex-1')}>
              <div className="flex flex-col items-center gap-1">
                {isReachable ? (
                  <button
                    type="button"
                    onClick={() => onSelect(n)}
                    className={nodeClass}
                    aria-label={meta.jp}
                  >
                    {content}
                  </button>
                ) : (
                  <div
                    className={nodeClass}
                    aria-disabled={!isCurrent || undefined}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {content}
                  </div>
                )}
                <span
                  className={cn(
                    'whitespace-nowrap text-xs',
                    isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {meta.jp}
                </span>
              </div>
              {n < total && (
                <span
                  aria-hidden
                  className={cn('mx-1 mb-5 mt-4 h-px flex-1', isDone ? 'bg-primary' : 'bg-border')}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mb-6 space-y-2 md:hidden">
        <p className="text-sm font-medium">
          {current}/{total} · {currentMeta?.jp}
        </p>
        <Progress value={(current / total) * 100} className="h-1.5" />
      </div>
    </>
  );
}
