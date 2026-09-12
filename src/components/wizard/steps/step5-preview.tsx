import { strings } from '@/lib/constants/strings';

interface Step5Props {
  data?: Record<string, unknown>;
  onReset: () => void;
}

export function Step5Preview({ onReset }: Step5Props) {
  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      <p>プレビュー — Coming in M1 (paper section)</p>
      <button onClick={onReset} className="mt-4 text-destructive underline">
        {strings.nav.back}
      </button>
    </div>
  );
}
