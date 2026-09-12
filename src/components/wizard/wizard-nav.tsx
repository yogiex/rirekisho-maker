'use client';

import { Button } from '@/components/ui/button';
import { strings } from '@/lib/constants/strings';

interface WizardNavProps {
  showBack: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardNav({ showBack, onBack, onNext }: WizardNavProps) {
  return (
    <nav
      aria-label={strings.nav.navAria}
      className="fixed inset-x-0 bottom-0 z-10 flex gap-3 border-t bg-background p-4 md:static md:justify-end md:border-0 md:p-0"
    >
      {showBack && (
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 md:h-10 md:flex-none md:px-8"
          onClick={onBack}
        >
          {strings.nav.back}
        </Button>
      )}
      <Button
        type="button"
        className="h-11 flex-[2] md:h-10 md:flex-none md:px-8"
        onClick={onNext}
      >
        {strings.nav.next}
      </Button>
    </nav>
  );
}
