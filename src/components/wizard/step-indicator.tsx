import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { strings } from '@/lib/constants/strings';

const STEPS = strings.steps.map((s) => ({ key: s.jp, label: s.jp }));

interface StepIndicatorProps {
  currentStep: number;
  visitedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, visitedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="py-4">
      <ol className="hidden md:flex items-center">
        {STEPS.map((step, i) => {
          const isCompleted = visitedSteps.has(i) && i < currentStep;
          const isCurrent = i === currentStep;
          const isClickable = visitedSteps.has(i);

          return (
            <li key={step.key} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(i)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-2 group',
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent && 'border-2 border-primary text-primary bg-background',
                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={cn(
                  'text-xs font-medium',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-3',
                  isCompleted ? 'bg-primary' : 'bg-border'
                )} />
              )}
            </li>
          );
        })}
      </ol>

      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {currentStep + 1}/{STEPS.length} · {STEPS[currentStep].label}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
