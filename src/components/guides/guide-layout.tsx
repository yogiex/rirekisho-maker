import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

export function GuideShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="font-semibold tracking-tight">
            履歴書メーカー
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/panduan" className="text-sm text-muted-foreground hover:text-foreground">
              Panduan
            </Link>
            <Button size="sm" render={<Link href="/" />}>
              Buat rirekisho
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-3xl px-4 py-6 text-xs text-muted-foreground md:px-6">
          Data tidak pernah dikirim ke server — semua diproses di browser Anda.
        </div>
      </footer>
    </div>
  );
}

export function GuideArticle({ children }: { children: ReactNode }) {
  return (
    <article className="space-y-8 text-[15px] leading-7 [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_table]:mt-4 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border-b [&_td]:py-2 [&_td]:align-top [&_td]:pr-4 [&_strong]:font-semibold">
      {children}
    </article>
  );
}

export function GuideCta({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-lg border bg-muted/40 p-5">
      <p className="text-sm">{children}</p>
      <Button className="mt-3" render={<Link href="/" />}>
        Mulai isi rirekisho
      </Button>
    </div>
  );
}

export function GuideNote({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-4 rounded-md border-l-4 border-primary/60 bg-muted/30 px-4 py-3 text-sm">
      {children}
    </aside>
  );
}
