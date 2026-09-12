import type { Metadata } from 'next';
import Link from 'next/link';

import { GuideShell } from '@/components/guides/guide-layout';

export const metadata: Metadata = {
  title: 'Panduan Rirekisho — Cara Membuat CV Jepang untuk Pelamar Indonesia',
  description:
    'Kumpulan panduan Bahasa Indonesia untuk mengisi rirekisho (履歴書): format JIS, aturan foto, furigana, riwayat pendidikan & kerja, dan 志望動機.',
};

const guides = [
  {
    href: '/panduan/cara-membuat-rirekisho',
    title: 'Cara Membuat Rirekisho (履歴書) — Panduan Lengkap',
    desc: 'Struktur format JIS, cara mengisi setiap kolom, aturan penulisan tanggal, dan kesalahan umum pelamar asing.',
  },
];

export default function PanduanPage() {
  return (
    <GuideShell>
      <h1 className="text-3xl font-semibold tracking-tight">Panduan Rirekisho</h1>
      <p className="mt-3 text-muted-foreground">
        Artikel Bahasa Indonesia untuk memahami CV Jepang sebelum Anda mengisinya.
      </p>
      <ul className="mt-8 space-y-4">
        {guides.map((g) => (
          <li key={g.href} className="rounded-lg border p-5">
            <Link href={g.href} className="text-lg font-semibold hover:underline">
              {g.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
          </li>
        ))}
      </ul>
    </GuideShell>
  );
}
