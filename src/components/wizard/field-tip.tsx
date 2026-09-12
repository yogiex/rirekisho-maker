import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { strings } from '@/lib/constants/strings';

interface FieldTipProps {
  text: string;
}

export function FieldTip({ text }: FieldTipProps) {
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          aria-label={strings.tips.ariaLabel}
          className="inline-flex text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info className="size-3.5" aria-hidden />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
