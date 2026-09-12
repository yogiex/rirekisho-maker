# Print QA — Rirekisho Maker

Jalankan sebelum setiap rilis. Gunakan "Save as PDF" di dialog cetak: kertas A4, margin "None", centang "Background graphics".

## Data uji

- **Sample mode**: tekan "Contoh data" (step 1 CTA atau tombol outline di step 5). Draft contoh berasal dari `createSampleDraft(today)` di `src/lib/constants/sample-draft.ts`.
- **Kasus 20 baris**: dari sample mode, tambah baris 学歴・職歴 hingga total 20 baris (campuran 入学/卒業/入社/退社, aktifkan 現在に至る). Ini memaksa halaman 2.
- **Draft kosong**: reset semua data, langsung ke step 5.

## Matriks

| # | Kasus | Chrome Win | Chrome Mac | Safari | Firefox |
|---|-------|:----------:|:----------:|:------:|:-------:|
| 1 | Sample mode → PDF tepat 1 halaman A4, tidak ada halaman kosong ekstra | [ ] | [ ] | [ ] | [ ] |
| 2 | Font Jepang tampil (tanpa tofu □), Noto Sans JP / fallback Hiragino·Yu Gothic | [ ] | [ ] | [ ] | [ ] |
| 3 | Latar header seksi (#f5f5f5) dan semua border tabel (1px #111) tercetak | [ ] | [ ] | [ ] | [ ] |
| 4 | Teks panjang (志望動機 300–400字, alamat panjang) wrap di dalam sel, tanpa overflow | [ ] | [ ] | [ ] | [ ] |
| 5 | Foto tampil bila diunggah; placeholder 写真 abu-abu bila tidak | [ ] | [ ] | [ ] | [ ] |
| 6 | Kasus 20 baris → halaman 2, tidak ada baris terpotong di tengah | [ ] | [ ] | [ ] | [ ] |
| 7 | Draft kosong → tidak crash, kertas tetap 1 halaman dengan placeholder | [ ] | [ ] | [ ] | [ ] |
| 8 | 作成日 (fillDate) dan 満年齢 sesuai tanggal hari ini; wareki benar | [ ] | [ ] | [ ] | [ ] |

Catat perbedaan margin/`@page` untuk Safari dan Firefox di bawah tabel saat menguji.

## Gate G-3

Rilis **lolos** jika baris #1–#4 **100% pass di Chrome Windows dan Chrome macOS**. Safari dan Firefox bersifat informatif (catat penyimpangan, bukan blocker).

## Lighthouse

```bash
pnpm build && npx serve out
```

Jalankan Lighthouse (Desktop) pada `http://localhost:3000`:

| Kategori | Target |
|----------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |

## Catatan

| Tanggal | Browser/OS | Hasil | Catatan |
|---------|------------|-------|---------|
| | | | |
