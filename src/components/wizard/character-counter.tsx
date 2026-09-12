import { Badge } from '@/components/ui/badge';
import { countChars, isNearLimit } from '@/lib/utils/counter';

interface CharacterCounterProps {
  value: string;
  max: number;
}

export function CharacterCounter({ value, max }: CharacterCounterProps) {
  const near = isNearLimit(value, max);

  return (
    <Badge
      variant="outline"
      className={
        near ? 'text-[10px] tabular-nums text-destructive' : 'text-[10px] tabular-nums text-muted-foreground'
      }
    >
      {countChars(value)} / {max}字
    </Badge>
  );
}
