<div align="center">

# 🇯🇵 Rirekisho Maker — 履歴書メーカー

**Buat CV Jepang (履歴書) format JIS langsung dari browser — gratis, tanpa akun,
data 100% tersimpan di perangkatmu.**

[![Deploy](https://github.com/yogiex/rirekisho-maker/actions/workflows/deploy.yml/badge.svg)](https://github.com/yogiex/rirekisho-maker/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Privacy: 100% client-side](https://img.shields.io/badge/privacy-100%25_client--side-2ea44f)
![Chrome-first printing](https://img.shields.io/badge/print-Chrome_first-4285F4)

**[🚀 Coba sekarang (Live Demo)](https://yogiex.github.io/rirekisho-maker/)** ·
[✨ Fitur](#-fitur) · [📖 Panduan](#-panduan) · [🔒 Privasi](#-privasi--keamanan) · [🛠️ Development](#️-development)

*English below · Bahasa: 🇮🇩 | 🇬🇧 *(segera)* | 🇯🇵 *(segera)*

</div>

---

> **English:** Rirekisho Maker is a free, open-source Japanese resume (履歴書)
> builder that runs entirely in your browser. No sign-up, no server — your data
> never leaves your device. Guided in Bahasa Indonesia, with etiquette tips for
> foreign applicants. Built with Next.js, TypeScript, and shadcn/ui.

---

## Kenapa ada project ini?

Warga Indonesia yang melamar kerja ke perusahaan Jepang wajib menyerahkan
**rirekisho** — dan di situlah masalahnya: labelnya bahasa Jepang (ふりがな？
扶養家族？), ada konvensi tak tertulis (foto, 和暦, 「現在に至る」), tool online
umumnya minta akun & mengunggah foto + data pribadi ke server, dan template
Word/Excel gampang berantakan tanpa pandangan apa pun.

**Rirekisho Maker** memandu langkah demi langkah **dalam Bahasa Indonesia**,
dengan tips etika penulisan untuk warga asing, lalu menghasilkan PDF A4 rapi
yang siap dikirim — semuanya tanpa satu byte pun data pribadi meninggalkan
browser-mu.

## 📸 Tampilan

| Form wizard | Preview kertas A4 |
|---|---|
| ![Form wizard](docs/assets/screenshot-wizard.png) | ![Preview kertas A4](docs/assets/screenshot-paper.png) |

<!-- TODO: tambahkan GIF alur singkat (≤10 dtk): "Coba dengan contoh" → Step 5 → Print -->

## ✨ Fitur

**Inti**
- 🧭 **Wizard 5 langkah** — 基本情報 → 学歴・職歴 → 免許・資格 → 志望動機 → Preview,
  validasi per langkah dalam Bahasa Indonesia
- 📄 **Preview kertas A4 akurat** — layout gaya JIS (panduan 2019, gender opsional),
  skala 1:1 dengan hasil cetak
- 🖨️ **Export PDF** via dialog cetak browser — tanpa watermark, tanpa batas
- 💾 **Auto-save** ke `localStorage` + restore otomatis — aman untuk diisi
  sambil commuting
- 📦 **Backup portabel** — export/import draft sebagai file JSON

**Pembeda (untuk pelamar asing)**
- 💡 **Tips etika per field** ⓘ — hiragana vs katakana untuk ふりがな, nama sesuai
  paspor, etika foto, kapan mulai menulis 学歴, cara menulis 志望動機 yang bagus
- 🗓️ **Konversi 和暦 otomatis** (令和/平成) + umur 満年齢 dihitung sendiri
- 🧪 **Mode contoh** — isi seluruh form dengan persona contoh untuk lihat hasil
  akhir dalam 2 menit
- 📷 **Crop foto 3:4 otomatis** + hapus metadata EXIF (termasuk lokasi GPS)
- 🚉 **Tabel kronologi terpadu** — 学歴 dan 職歴 dalam satu tabel urut waktu,
  lengkap dengan 「現在に至る」 dan 「以上」 sesuai konvensi

## 🔒 Privasi & Keamanan

Privasi bukan sekadar janji di halaman — dipaksa secara teknis:

- **Tanpa server, tanpa akun, tanpa analytics.** Semua pemrosesan (termasuk
  kompresi foto) terjadi di browser-mu.
- **CSP `connect-src 'none'`** — meski ada kode berbahaya yang lolos, ia tidak
  punya jalur jaringan untuk mengirim data keluar. Buktikan sendiri: buka
  DevTools → Network → isi form → **nol request keluar**.
- **Metadata EXIF foto (termasuk GPS) dihapus otomatis** saat diproses.
- **Import JSON tervalidasi berlapis** (ukuran → versi → schema Zod) dengan
  regression test anti prototype-pollution.
- ⚠️ **Kejujuran soal batasan:** draft tersimpan **tidak terenkripsi** di
  `localStorage` browser ini. Jika memakai komputer bersama (warnet/kantor),
  gunakan tombol **Reset** setelah selesai. Detail lengkap:
  [SECURITY.md](SECURITY.md).

## 🚀 Mulai Cepat

1. Buka **[demo live](https://yogiex.github.io/rirekisho-maker/)** (atau
   klik 「Coba dengan contoh」 untuk lihat hasil jadi dulu)
2. Lengkapi 4 langkah form — ikuti tips ⓘ di setiap field penting
3. Cek Step 5: preview kertas harus persis seperti PDF nanti
4. Klik 「PDFとして保存 / 印刷」

> 📱 Bisa dari HP. Draft tersimpan otomatis — tutup dan lanjutkan kapan saja.

## 🖨️ Tips export PDF terbaik

| Setting | Nilai |
|---|---|
| Browser | **Google Chrome** (hasil paling akurat) |
| Tujuan | Save as PDF |
| Kertas | A4 · Margin: **None** · Scale: Default |
| ✅ | Centang **Background graphics** (agar garis & header tabel tercetak) |

Safari/Firefox tetap berfungsi, tapi dengan sedikit perbedaan margin — sesuaikan
di dialog cetak.

## 📖 Panduan

Panduan lengkap cara membuat rirekisho dalam Bahasa Indonesia (struktur kolom,
konvensi 和暦, tips untuk warga asing) tersedia di situs:

- **[Panduan](https://yogiex.github.io/rirekisho-maker/panduan/)** — indeks panduan
- **[Cara membuat rirekisho](https://yogiex.github.io/rirekisho-maker/panduan/cara-membuat-rirekisho/)** — langkah demi langkah

## ❓ FAQ

**Apakah Rirekisho Maker gratis?** Ya, selamanya. Open source MIT — tanpa akun,
tanpa watermark, tanpa batas unduhan.

**Apakah data saya aman?** Data tidak pernah dikirim ke server mana pun —
tersimpan hanya di browser Anda. Buktikan sendiri: buka DevTools → tab Network,
isi form, dan lihat tidak ada request keluar. Batasannya: tersimpan tanpa
enkripsi di browser — lihat bagian [Privasi](#-privasi--keamanan).

**Apakah formatnya resmi?** Mengikuti konvensi umum 履歴書 gaya JIS (revisi
panduan 2019). Bukan formulir resmi pemerintah — sebagian perusahaan memiliki
format ketentuan sendiri, konfirmasikan ke perekrut bila ragu.

**Bisakah dipakai dari ponsel?** Bisa. Draft tersimpan otomatis di browser —
tutup dan lanjutkan kapan saja, termasuk pindah perangkat via file JSON.

**Bagaimana cara export PDF?** Klik 印刷 di langkah terakhir, pilih "Save as
PDF". Gunakan Chrome, kertas A4, margin "None", dan centang "Background
graphics" agar garis tabel tercetak.

**Saya warga asing, apakah cara mengisinya berbeda?** Ada beberapa konvensi
khusus — furigana dalam hiragana, nama sesuai paspor, titik mulai riwayat —
setiap kolom penting punya tips ⓘ di dalam aplikasi. Gunakan fitur "Coba dengan
contoh" untuk melihat hasil akhirnya.

**Bisa untuk 職務経歴書?** Belum — ada di [roadmap](#-roadmap).

## 🛠️ Teknologi

| Layer | Teknologi |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router, `output: 'export'`) |
| UI | [shadcn/ui](https://ui.shadcn.com) · Tailwind CSS · lucide-react |
| Form & validasi | react-hook-form + Zod |
| Font | Noto Sans JP (self-hosted via `next/font`) |
| Tes | Vitest — termasuk security regression tests |
| Deploy | GitHub Pages via GitHub Actions (static, `.nojekyll`) |

## 💻 Development

```bash
# Prasyarat: Node.js 20+ · pnpm
git clone https://github.com/yogiex/rirekisho-maker.git
cd rirekisho-maker
pnpm install
pnpm dev            # http://localhost:3000

pnpm build          # static export → out/
pnpm test           # vitest (unit + security tests)
pnpm lint           # termasuk aturan render-discipline (SEC-05)
```

<details>
<summary>⚙️ Catatan konfigurasi</summary>

- `NEXT_PUBLIC_BASE_PATH=/rirekisho-maker` di `.env.production` — **wajib
  sama dengan nama repo** agar asset tidak 404 di GitHub Pages.
  *(dev lokal tidak perlu — gunakan `.env.local` kosong)*
- Komponen shadcn ditambah via CLI: `pnpm dlx shadcn@latest add <component>`
  (jangan edit manual `components/ui/`).
- Deploy otomatis ke `gh-pages` setiap push ke `main` (lihat
  `.github/workflows/deploy.yml`).

</details>

<details>
<summary>🔎 Untuk maintainer: Google Search Console (GSC)</summary>

Satu-satunya sumber data trafik (PRD D-15) — tanpa JS analitik client, agar CSP
`connect-src 'none'` tetap utuh.

- [ ] GSC → Add property (URL prefix) `https://yogiex.github.io/rirekisho-maker/`
- [ ] Pilih verifikasi **HTML file** → simpan `google*.html` ke `public/`
      (ikut ter-copy ke `out/` saat build) → push → klik Verify
- [ ] Sitemaps → submit `https://yogiex.github.io/rirekisho-maker/sitemap.xml`
- [ ] Bing Webmaster Tools → **Import from GSC** (tanpa verifikasi ulang)
- [ ] Cek URL Inspection untuk `/`, `/panduan/`, `/panduan/cara-membuat-rirekisho/`

</details>

### 📚 Dokumentasi Produk

Repo ini dikerjakan dengan dokumentasi lengkap — masing-masing jadi *single
source of truth*:

| Dokumen | Isi |
|---|---|
| [PRD.md](PRD.md) | Visi, persona, requirement produk, metrik sukses, decision log |
| [FEATURE.md](FEATURE.md) | Spesifikasi teknis: data model, validasi, alur, acceptance criteria |
| [DESIGN.md](DESIGN.md) | Design system: token warna, tipografi, spesifikasi kertas A4 |
| [SECURITY.md](SECURITY.md) | Threat model, requirement security, disclosure policy |

## 🗺️ Roadmap

**Selesai (MVP)**
- [x] Wizard 5 langkah + validasi Bahasa Indonesia
- [x] Preview kertas A4 gaya JIS + export PDF (Chrome-first)
- [x] Auto-save + JSON export/import
- [x] Field tips, mode contoh, konversi 和暦
- [x] Security hardening (CSP, EXIF strip, import gate)

**Berikutnya**
- [ ] Auto-lock untuk komputer bersama · crop foto manual (drag/zoom)
- [ ] UI English / 日本語
- [ ] 職務経歴書 builder (dokumen riwayat kerja terpisah)
- [ ] Multi-profil CV · package npm `wareki` (ekstraksi konverter 和暦)

Punya usulan? [Buka issue](../../issues) — dengan senang hati dibaca.

## 🤝 Kontribusi

Kontribusi kecil maupun besar diterima. Sebelum mulai:
1. Baca [FEATURE.md](FEATURE.md) dan [DESIGN.md](DESIGN.md) (konvensi & hard rules)
2. Aturan penting: **tanpa network call**, **tanpa dependency baru tanpa
   justifikasi**, semua string user-facing di `strings.ts` — lihat
   [SECURITY.md](SECURITY.md)

## 🔐 Melaporkan kerentanan

Jangan buka issue publik untuk laporan keamanan — gunakan
[Private Vulnerability Reporting](../../security/advisories/new). Kebijakan
lengkap: [SECURITY.md → Part B](SECURITY.md).

## 📄 Lisensi

[MIT](LICENSE) © [Nama Kamu]

Dibuat dengan ❤️ untuk para pencari kerja Indonesia di Jepang 🇮🇩→🇯🇵
Terima kasih kepada komunitas shadcn/ui, tim Noto Sans JP, dan referensi
template 履歴書 publik yang menjadi acuan layout.
