'use client';

import { Button } from '@/components/ui/button';
import { strings } from '@/lib/constants/strings';

interface WizardNavProps {
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export function WizardNav({ onPrev, onNext, isFirst, isLast, isSaving, lastSaved }: WizardNavProps) {
  return (
    <>
      <div className="hidden md:flex items-center justify-between py-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {isSaving ? (
            <span>保存中...</span>
          ) : lastSaved ? (
            <span>自動保存済み • {lastSaved.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
          ) : null}
        </div>
        <div className="flex gap-2">
          {!isFirst && (
            <Button variant="outline" onClick={onPrev}>
              {strings.nav.back}
            </Button>
          )}
          <Button onClick={onNext}>
            {isLast ? strings.steps[4].jp : strings.nav.next}
          </Button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-background border-t border-border flex items-center px-4 gap-2 z-50">
        {!isFirst ? (
          <Button variant="outline" className="flex-1 h-11" onClick={onPrev}>
            {strings.nav.back}
          </Button>
        ) : (
          <div className="flex-1" />
        )}
        <Button className="flex-[2] h-11" onClick={onNext}>
          {isLast ? strings.steps[4].jp : strings.nav.next}
        </Button>
      </div>
    </>
  );
}
