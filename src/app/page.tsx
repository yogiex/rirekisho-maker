'use client';

import { WizardShell } from '@/components/wizard/wizard-shell';
import { strings } from '@/lib/constants/strings';

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{strings.appTitle}</h1>
            <p className="text-xs text-muted-foreground">{strings.appSubtitle}</p>
          </div>
        </div>
      </header>
      <WizardShell />
      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        {strings.privacyNote}
      </footer>
    </main>
  );
}
