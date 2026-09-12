# Security Policy — Rirekisho Maker

**Tanggal efektif:** 2026-09-12
**Terakhir diperbarui:** 2026-09-12
**Versi dokumen:** 1.0

> Dokumen ini adalah otoritas keamanan untuk proyek Rirekisho Maker.
> Merujuk pada PRD sections SEC-01 hingga SEC-08 dan keputusan desain
> terkait (D-9, D-10).

---

## Part A — Security Requirements

### SEC-01: Content Security Policy (CSP)

**Tujuan:** Mencegah data pengguna bocor ke jaringan meskipun ada kode berbahaya
yang lolos ke DOM.

**Spesifikasi:**

| Directive | Nilai | Alasan |
|---|---|---|
| `connect-src` | `'none'` | Blokir semua permisi jaringan (fetch, XHR, WebSocket) |
| `script-src` | `'self'` | Hanya izinkan skrip dari origin sendiri |
| `style-src` | `'self' 'unsafe-inline'` | Diperlukan untuk inline styles (Tailwind) |
| `img-src` | `'self' blob: data:` | Izinkan foto dari localStorage (data URI) dan canvas (blob) |
| `font-src` | `'self'` | Font self-hosted via `next/font` |
| `object-src` | `'none'` | Blokir plugin (Flash, Java, dll.) |
| `base-uri` | `'self'` | Cegah base tag injection |
| `form-action` | `'none'` | Cegah form submission ke eksternal |
| `frame-ancestors` | `'none'` | Cegah clickjacking |

**Implementasi:**
- CSP dikonfigurasi melalui HTTP headers di GitHub Pages (melalui meta tag atau
  server config). Karena ini static export, CSP harus diatur di `next.config.ts`
  atau via `<meta http-equiv="Content-Security-Policy">` di `layout.tsx`.
- Saat ini aplikasi berjalan tanpa CSP header aktif di production — ini adalah
  gap yang harus ditutup sebelum rilis production.

**Cara memverifikasi:**
1. Buka DevTools → Console
2. Navigasi seluruh aplikasi
3. Cek `Content-Security-Policy` header di tab Network
4. Pastikan `connect-src 'none'` aktif — nol request jaringan harus keluar

---

### SEC-02: No Server Communication

**Tujuan:** Jaminan arsitektural bahwa data pengguna tidak pernah meninggalkan
browser.

**Arsitektur:**
```
┌─────────────────────────────────────┐
│           Browser (Client)          │
│                                     │
│  React App ──→ localStorage        │
│  React App ──→ Canvas API          │
│  React App ──→ File System (API)   │
│                                     │
│  ❌ fetch()  ❌ XHR  ❌ WebSocket  │
│  ❌ Server  ❌ Database  ❌ CDN     │
└─────────────────────────────────────┘
```

**Bukti teknis:**
- `next.config.ts`: `output: 'export'` — statis, tanpa server-side rendering
- Tidak ada `getServerSideProps`, `getStaticProps`, atau API routes
- Tidak ada `fetch()` atau `axios` di seluruh codebase
- Tidak ada variabel environment yang menunjuk ke API endpoint
- CSP `connect-src 'none'` memblokir secara teknis semua permisi jaringan

**Implikasi:**
- Tidak ada authentication/authorization
- Tidak ada logging analytics
- Tidak ada error reporting eksternal
- Tidak ada CDN yang bisa intercept data

---

### SEC-03: Input Validation

**Tujuan:** Validasi berlapis untuk mencegah data tidak valid atau berbahaya masuk
ke aplikasi.

**Lapisan 1 — Form Input (Frontend):**
- React Hook Form + Zod schema (`src/lib/schema/rirekisho-schema.ts`)
- Validasi real-time per field saat pengguna mengisi
- Regex ketat untuk format Jepang:
  - ふりがな: `^[\u3040-\u309Fー]+$` (hiragana only)
  - 郵便番号: `^\d{3}-?\d{4}$`
  - 電話番号: `^0\d{1,4}-?\d{1,4}-?\d{3,4}$`
- String length limits (max 40-400 karakter tergantung field)
- Enum constraints untuk field terbatas (gender, action, category)

**Lapisan 2 — Import Gate:**
```
File Upload → JSON.parse() → rirekishoSchema.safeParse() → Accept/Reject
```
- `JSON.parse()` menangkap JSON tidak valid (syntax error)
- `rirekishoSchema.safeParse()` memvalidasi struktur lengkap
- Tidak ada `eval()` atau `Function()` — data tidak pernah dieksekusi sebagai kode
- Error message di-render via React (auto-escaped), bukan innerHTML

**Lapisan 3 — Draft Load:**
- `loadDraft()` di `src/lib/storage/draft.ts` menerapkan validasi yang sama
- `DRAFT_VERSION` check — draft versi lama di-backup dan ditolak
- `try-catch` untuk menangkap corrupted data

**Pencegahan Prototype Pollution:**
- `JSON.parse()` menghasilkan plain object — tidak mengeksekusi `__proto__` setter
- Zod `safeParse()` hanya memproses properti yang didefinisikan di schema
- Extra properties diabaikan (Zod default: `strip` mode)
- Tidak ada `Object.assign()`, spread operator pada user input, atau deep merge

---

### SEC-04: XSS Prevention

**Tujuan:** Mencegah Cross-Site Scripting melalui React rendering pipeline.

**Mekanisme pertahanan:**
1. **React auto-escaping:** Semua JSX children dan properti string di-escape
   secara otomatis. Karakter `<`, `>`, `&`, `"`, `'` dikonversi ke HTML entities.
2. **Tidak ada `dangerouslySetInnerHTML` pada data user:** Satu-satunya penggunaan
   ada di `src/components/seo/json-ld.tsx` untuk JSON-LD statis build-time (lihat SEC-05-E).
3. **Tidak ada `document.write()` atau `innerHTML` assignment:** Pencarian menunjukkan
   nol penggunaan langsung ke DOM.
4. **Tidak ada `eval()` atau `Function()`:** Tidak ada dynamic code execution.
5. **Zod schema enforcement:** Input dikonstruksi ulang sebagai typed object —
   properti tambahan dibuang.

**Attack vector yang ditutupi:**
| Vector | Status | Mitigation |
|---|---|---|
| Stored XSS via form input | ✅ Termitigasi | React auto-escaping |
| Reflected XSS via URL | ✅ Termitigasi | Tidak ada server-side rendering, tidak ada query param |
| DOM-based XSS | ✅ Termitigasi | Tidak ada innerHTML, eval, atau dynamic script |
| SVG injection | ✅ Termitigasi | Tidak ada rendering SVG dari user input |
| Import file XSS | ✅ Termitigasi | JSON.parse → Zod validasi → typed object |

---

### SEC-05: Render Discipline

**Tujuan:** Mencegah injeksi kode melalui mekanisme rendering non-standar.

**Aturan:**
- Tidak ada `eval()`, `new Function()`, atau `setTimeout(string)` di codebase
- Tidak ada dynamic `import()` dengan user-controlled path
- Tidak ada `document.createElement('script')` atau penambahan script ke DOM
- Tidak ada `srcdoc` attribute pada iframe
- Semua komponen menggunakan JSX statis atau variabel yang di-escape React

**Enforcement:**
- ESLint rule `no-eval` (via eslint-config-next) menangkap `eval()` usage
- Code review wajib untuk setiap PR yang menambahkan akses DOM langsung
- Security regression tests memverifikasi tidak ada pattern berbahaya

**Eksepsi SEC-05-E (JSON-LD):** `dangerouslySetInnerHTML` diizinkan HANYA di
`src/components/seo/json-ld.tsx` untuk payload `JSON.stringify` dari objek
literal build-time (tanpa input user). Setiap penggunaan lain tetap dilarang.

---

### SEC-06: EXIF / Metadata Stripping

**Tujuan:** Menghapus metadata sensitif (termasuk GPS lokasi) dari foto yang
diunggah pengguna.

**Pipeline pemrosesan (`src/lib/utils/photo.ts`):**
```
File Upload
  → createImageBitmap(file, { imageOrientation: 'from-image' })
    → Canvas redraw (600×800, crop 3:4)
      → canvas.toBlob('image/jpeg', quality)
        → FileReader.readAsDataURL()
          → Data URI string (tanpa EXIF)
```

**Mekanisme stripping:**
- `createImageBitmap` membaca pixel data saja — metadata EXIF tidak dibawa
- Canvas redraw menghasilkan JPEG baru tanpa metadata apapun
- Output adalah data URI (`data:image/jpeg;base64,...`) — format lossy yang
  tidak mempertahankan metadata

**Properti yang dihapus:**
- GPS coordinates (latitude, longitude, altitude)
- Kamera model dan serial number
- Timestamp pengambilan foto
- Software/firmware version
- Orientation EXIF (dihandle oleh `imageOrientation: 'from-image'` sebelum redraw)

**Properti yang dipertahankan:**
- Dimensi output: 600×800 px (3:4 ratio, standar rirekisho)
- Format: JPEG dengan quality kompresi adaptif (0.85 → 0.30)

---

### SEC-07: Data Lifecycle

**Tujuan:** Mengelola siklus hidup data pengguna dengan transparansi dan kontrol.

**Storage mechanism:**
- **Medium:** `localStorage` browser
- **Key:** `rirekisho-draft` (primary), `rirekisho-draft-backup` (backup)
- **Format:** JSON dengan wrapper `DraftPayload { version, savedAt, data }`
- **Enkripsi:** ❌ Tidak ada (keputusan desain D-9)

**Alasan tidak ada enkripsi (D-9):**
1. Enkripsi client-side memerlukan key management — key harus disimpan di
   browser juga, sehingga enkripsi tidak menambah keamanan substansial
2. `localStorage` sudah di-sandbox per origin oleh browser
3. HTTPS (GitHub Pages) mencegah MITM
4. Trade-off: kemudahan debugging vs keamanan — dipilih kemudahan untuk MVP

**Draft versioning:**
- `DRAFT_VERSION = 1` (didefinisikan di `src/types/rirekisho.ts`)
- Saat load, jika version mismatch → draft lama di-backup ke `BACKUP_KEY`,
  draft utama dihapus, return `null`
- Mencegah data corruption dari schema yang berubah antar versi

**Full Reset (SEC-07):**
- Tombol Reset menghapus kedua localStorage keys (`rirekisho-draft` dan
  `rirekisho-draft-backup`)
- Tidak ada recovery setelah reset
- Pengguna harus konfirmasi sebelum reset

**Pandangan untuk komputer bersama (shared computer):**
> ⚠️ **PERINGATAN:** Jika menggunakan komputer bersama (warnet, kantor,
> perpustakaan), data tersimpan di localStorage komputer tersebut. Siapapun
> yang menggunakan komputer yang sama setelahmu BISA mengakses draft-mu.
>
> **Mitigasi wajib:**
> 1. Selalu klik **Reset** setelah selesai
> 2. Export draft sebagai file JSON dan simpan di flashdisk
> 3. Hapus file JSON setelah digunakan
> 4. Gunakan mode incognito/private browsing (data hilang saat tutup tab)
> 5. Jangan centang "Remember me" atau biarkan session aktif

**Quota handling:**
- `saveDraft()` menangkap `QuotaExceededError` dan melempar error `QUOTA_EXCEEDED`
- Photo dikompresi secara adaptif (quality 0.85 → 0.30) untuk menjaga ukuran
  di bawah 500KB per foto
- `saveDraftDebounced()` mencegah terlalu banyak write dalam waktu singkat

---

### SEC-08: Supply Chain Security

**Tujuan:** Memastikan dependensi tidak dikompromikan.

**Langkah yang diimplementasikan:**
1. **Frozen lockfile:** `pnpm install --frozen-lockfile` di CI — menjamin
   reproducible builds, dependency resolution tidak berubah saat build
2. **Dependency audit:** `pnpm audit` harus dijalankan secara berkala (belum
   terautomasi di CI — gap yang harus ditutup)
3. **Minimal dependencies:** Hanya 14 production dependencies — smaller attack
   surface
4. **No dynamic imports dari CDN:** Semua dependencies di-bundle secara statis

**GitHub Actions pinning:**
```yaml
# deploy.yml — pin ke versi major untuk stabilitas
- uses: actions/checkout@v4        # ← v4, bukan @main
- uses: actions/setup-node@v4      # ← v4, bukan @main
- uses: actions/upload-pages-artifact@v3
- uses: actions/deploy-pages@v4
```

**Catatan:** Actions dipin ke versi major (v3, v4) — ini trade-off antara
keamanan (pin ke SHA) dan kemudahan maintenance. Untuk production kritis,
pertimbangkan pin ke commit SHA.

**Dependency inventory (production):**
| Package | Version | Fungsi | Risk |
|---|---|---|---|
| next | 16.3.4 | Framework | Core — high scrutiny |
| react / react-dom | 19.2.8 | UI library | Core — widely audited |
| zod | ^4.6.2 | Schema validation | Security-critical |
| react-hook-form | ^7.87.0 | Form management | Low risk |
| shadcn | ^4.21.0 | UI components | Low risk |
| sonner | ^2.0.8 | Toast notifications | Low risk |
| lucide-react | ^1.44.0 | Icons | Low risk |
| next-themes | ^0.4.6 | Theme management | Low risk |

---

## Part B — Vulnerability Disclosure Policy

### Cara Melaporkan

**⚠️ JANGAN buka issue publik untuk laporan keamanan.**

Gunakan salah satu metode berikut:
1. **GitHub Private Vulnerability Reporting** — preferred
   → [Buka laporan](https://github.com/yogiex/rirekisho-maker/security/advisories/new)
2. **Email:** (belum tersedia — buka issue meminta contact jika diperlukan)

**Format laporan yang diharapkan:**
- Deskripsi kerentanan (apa, bagaimana, mengapa)
- Langkah reproduksi (step-by-step)
- Impact assessment (apa yang bisa dilakukan penyerang)
- Bukti konsep (screenshot, PoC code, atau HTTP request)
- Saran remediasi (jika ada)

### Yang Diharapkan

| Tahap | SLA | Detail |
|---|---|---|
| Acknowledgment | ≤ 48 jam | Konfirmasi penerimaan laporan |
| Triage | ≤ 1 minggu | Klasifikasi severity (Critical/High/Medium/Low) |
| Fix | ≤ 2 minggu (Critical) | Patch atau mitigasi untuk vulnerability kritis |
| Disclosure | Setelah fix | Coordinated disclosure bersama reporter |

### Safe Harbor

Kami mendukung responsible disclosure. Reporter yang bertindak dalam itikad baik
dijamin:
- Tidak akan dituntut secara hukum untuk aktivitas testing yang dilakukan
  sesuai kebijakan ini
- Tidak akan dibanned dari platform GitHub
- Akan diakui dalam release notes (kecuali reporter meminta anonimitas

**Batasan testing:**
- Hanya test di application sendiri (jangan test ke server pihak ketiga)
- Jangan akses data pengguna lain
- Jangan melakukan destructive testing (hapus data, corrupt database)
- Jangan menggunakan vulnerability untuk mengeksploitasi pengguna lain

---

## Part C — Threat Model

### Asset Identification

| Asset | Sensitivity | Storage | Nilai |
|---|---|---|---|
| Nama lengkap (氏名) | Tinggi | localStorage | PII — identitas |
| Alamat (住所) | Tinggi | localStorage | PII — lokasi |
| Nomor telepon | Tinggi | localStorage | PII — kontak |
| Email | Tinggi | localStorage | PII — kontak |
| Foto | Tinggi | localStorage (data URI) | Biometrik + metadata |
| Riwayat pendidikan | Menengah | localStorage | Akademik |
| Riwayat pekerjaan | Menengah | localStorage | Profesional |
| Nomor induk kependudukan | Rendah | Tidak disimpan | Tidak ada |

### Trust Boundaries

```
┌──────────────────────────────────────────────────────┐
│                  TRUST BOUNDARY: BROWSER             │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │  React App  │  │  localStorage│  │  Canvas API  │ │
│  │  (Untrusted │  │  (Tearable  │  │  (EXIF-free  │ │
│  │   code from │  │   per-user) │  │   pixels)    │ │
│  │   CDN/source│  │             │  │              │ │
│  │   files)    │  │             │  │              │ │
│  └─────────────┘  └─────────────┘  └──────────────┘ │
│                                                      │
│  ──────────── BOUNDARY: NO NETWORK ACCESS ────────── │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  External World (Blocked by CSP)            │    │
│  │  ❌ APIs  ❌ CDNs  ❌ Analytics  ❌ Ads     │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### Threat Scenarios

#### T1: Cross-Site Scripting (XSS)

| Aspek | Detail |
|---|---|
| **Vector** | User input yang mengandung JavaScript code |
| **Attack** | Penyerang menyisipkan `<script>alert(1)</script>` ke field form |
| **Impact** | Dapat membaca localStorage, mencuri data, melakukan aksi atas nama user |
| **Mitigation** | React auto-escaping + dangerouslySetInnerHTML hanya untuk JSON-LD statis (SEC-05-E) + CSP |
| **Residual Risk** | Rendah — multiple layers of defense |
| **Verification** | Security regression test + ESLint rules |

#### T2: Shared Computer Data Leak

| Aspek | Detail |
|---|---|
| **Vector** | Pengguna lupa logout/hapus di komputer bersama |
| **Attack** | Pengguna berikutnya membuka aplikasi → draft tersedia di localStorage |
| **Impact** | PII pengguna sebelumnya terpapar |
| **Mitigation** | Warning UI + tombol Reset + guidance di SECURITY.md |
| **Residual Risk** | Menengah — behavioral, tidak bisa di-lock secara teknis |
| **Verification** | User education + clear UI prompts |

#### T3: Device Theft / Physical Access

| Aspek | Detail |
|---|---|
| **Vector** | Perangkat dicuri atau diakses fisik oleh penyerang |
| **Attack** | Akses langsung ke browser storage (localStorage) |
| **Impact** | Semua data draft tersedia |
| **Mitigation** | OS-level encryption (FileVault, BitLocker) + auto-lock |
| **Residual Risk** | Menengah — tergantung OS security |
| **Verification** | Manual — user responsibility |

#### T4: Supply Chain Attack

| Aspek | Detail |
|---|---|
| **Vector** | Dependency yang dikompromikan (malicious package) |
| **Attack** | Package update mengandung kode berbahaya (exfiltration, backdoor) |
| **Impact** | Kode berbahaya berjalan di browser semua pengguna |
| **Mitigation** | Frozen lockfile + minimal deps + CSP connect-src 'none' |
| **Residual Risk** | Rendah — CSP memblokir exfiltration meskipun kode berbahaya ada |
| **Verification** | `pnpm audit` + manual dependency review |

#### T5: Man-in-the-Middle (MITM)

| Aspek | Detail |
|---|---|
| **Vector** | Penyerang intercept traffic antara browser dan server |
| **Attack** | Intercept data yang dikirim ke server |
| **Impact** | N/A — tidak ada data yang dikirim ke server |
| **Mitigation** | HTTPS (GitHub Pages) + connect-src 'none' (double protection) |
| **Residual Risk** | Sangat rendah — tidak ada traffic yang bisa di-intercept |

#### T6: Malicious Import File

| Aspek | Detail |
|---|---|
| **Vector** | File JSON import yang sengaja dibuat berbahaya |
| **Attack** | File berisi prototype pollution payload atau malformed data |
| **Impact** | Prototype pollution → XSS → data theft |
| **Mitigation** | JSON.parse → Zod safeParse → typed object creation |
| **Residual Risk** | Rendah — Zod strip mode membuang properti tak dikenal |
| **Verification** | Security regression test dengan payload berbahaya |

---

## Part D — Security Testing

### Tes yang Ada

**1. Unit Tests (Vitest)**
- Schema validation tests — memverifikasi Zod schema menolak input tidak valid
- Import validation tests — memverifikasi import gate bekerja dengan benar
- Draft versioning tests — memverifikasi backup behavior pada version mismatch

**2. Lint Rules (ESLint)**
- `no-eval` — menangkap `eval()` usage
- TypeScript strict mode — type safety mencegah type coercion bugs
- No dangerouslySetInnerHTML kecuali `json-ld.tsx` (SEC-05-E, payload statis)

**3. Security Regression Tests**
- Prototype pollution payloads (JSON import)
- Schema bypass attempts
- Draft corruption recovery

### Cara Menjalankan

```bash
# Jalankan semua tes
pnpm test

# Jalankan lint
pnpm lint

# Jalankan build (memverifikasi tidak ada error type)
pnpm build

# Audit dependencies
pnpm audit
```

### Cakupan Testing

| Area | Coverage | Status |
|---|---|---|
| Schema validation | ✅ Covered | Unit tests |
| Import validation | ✅ Covered | Security regression |
| Draft versioning | ✅ Covered | Unit tests |
| XSS prevention | ⚠️ Partial | ESLint + manual review |
| CSP enforcement | ❌ Not automated | Manual verification only |
| EXIF stripping | ⚠️ Partial | Manual verification |
| Supply chain | ⚠️ Partial | `pnpm audit` manual |

### Gap yang Perlu Ditutup

1. **CSP automated test** — belum ada test yang memverifikasi CSP headers
2. **EXIF stripping test** — belum ada test yang memverifikasi metadata terhapus
   setelah pemrosesan
3. **CI security scan** — belum ada `pnpm audit` di pipeline CI
4. **E2E security tests** — belum ada Playwright/Cypress tests untuk attack
   scenarios

---

## Appendix: Referensi

| Dokumen | Lokasi |
|---|---|
| PRD (SEC-01 s.d. SEC-08) | `PRD.md` |
| Feature spec | `FEATURE.md` |
| Risk register | `docs/risk-register.md` |
| Decision log (D-9, D-10) | `PRD.md` (Decision Log section) |
| Source: schema validation | `src/lib/schema/rirekisho-schema.ts` |
| Source: draft storage | `src/lib/storage/draft.ts` |
| Source: photo processing | `src/lib/utils/photo.ts` |
| Source: draft versioning | `src/types/rirekisho.ts` |
| Source: deploy config | `.github/workflows/deploy.yml` |

---

*Dokumen ini bersifat living document — perbarui setiap kali ada perubahan
arsitektur, dependency, atau threat landscape.*
