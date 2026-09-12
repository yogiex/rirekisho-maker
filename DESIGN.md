# Design System — Rirekisho Maker

Panduan desain komprehensif untuk aplikasi pembuatan 履歴書 (rirekisho) berbasis web.
Dokumen ini mendefinisikan token, komponen, dan pola yang dipakai di seluruh codebase.

---

## 1. Design Principles

### 1.1 Privacy-First UI

Aplikasi ini berjalan **sepenuhnya di client-side**. Tidak ada server, tidak ada upload,
tidak ada akun. Semua data tersimpan di `localStorage` sebagai draft lokal.

- Tidak ada network request untuk data pengguna
- Photo diproses di browser via Canvas API, tidak dikirim ke server
- User bisa clear semua data kapan saja via tombol reset

### 1.2 Print-Fidelity

Tujuan utama aplikasi adalah menghasilkan PDF yang **identik dengan kertas fisik**.

- Paper preview harus 1:1 dengan output PDF (794×1123px = A4 96dpi)
- Margin, font size, dan border harus presisi sesuai standar JIS
- Print stylesheet harus menghasilkan tepat 1 halaman A4

### 1.3 Mobile-First

Dirancang untuk digunakan di smartphone terlebih dahulu.

- Layout responsif dari 375px (iPhone SE) hingga desktop
- Step navigation: progress bar di mobile, horizontal stepper di desktop
- Bottom nav fixed di mobile untuk akses navigasi yang mudah

### 1.4 Single-Purpose

Aplikasi ini hanya untuk satu hal: membuat 履歴書. Setiap elemen UI harus mendukung
tujuan tersebut tanpa fitur tambahan yang tidak perlu.

---

## 2. Color System

### 2.1 Token Colors (oklch)

Semua warna didefinisikan sebagai CSS custom properties di `:root` menggunakan oklch color space.

| Token | Value | Deskripsi |
|---|---|---|
| `--background` | `oklch(1 0 0)` | Background utama (putih) |
| `--foreground` | `oklch(0.145 0 0)` | Teks utama (hampir hitam) |
| `--card` | `oklch(1 0 0)` | Background card |
| `--card-foreground` | `oklch(0.145 0 0)` | Teks dalam card |
| `--popover` | `oklch(1 0 0)` | Background popover/dropdown |
| `--popover-foreground` | `oklch(0.145 0 0)` | Teks popover |
| `--primary` | `oklch(0.205 0 0)` | Warna primer (gelap) |
| `--primary-foreground` | `oklch(0.985 0 0)` | Teks di atas primary |
| `--secondary` | `oklch(0.97 0 0)` | Background sekunder (abu terang) |
| `--secondary-foreground` | `oklch(0.205 0 0)` | Teks sekunder |
| `--muted` | `oklch(0.97 0 0)` | Background muted |
| `--muted-foreground` | `oklch(0.556 0 0)` | Teks muted (abu) |
| `--accent` | `oklch(0.97 0 0)` | Background accent |
| `--accent-foreground` | `oklch(0.205 0 0)` | Teks accent |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Warna error/hapus (merah) |
| `--border` | `oklch(0.922 0 0)` | Warna border default |
| `--input` | `oklch(0.922 0 0)` | Border input field |
| `--ring` | `oklch(0.708 0 0)` | Warna focus ring |

### 2.2 Chart Colors

| Token | Value | Usage |
|---|---|---|
| `--chart-1` | `oklch(0.87 0 0)` | Chart series 1 (paling terang) |
| `--chart-2` | `oklch(0.556 0 0)` | Chart series 2 |
| `--chart-3` | `oklch(0.439 0 0)` | Chart series 3 |
| `--chart-4` | `oklch(0.371 0 0)` | Chart series 4 |
| `--chart-5` | `oklch(0.269 0 0)` | Chart series 5 (paling gelap) |

### 2.3 Sidebar Colors

| Token | Value |
|---|---|
| `--sidebar` | `oklch(0.985 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` |
| `--sidebar-primary` | `oklch(0.205 0 0)` |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | `oklch(0.97 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` |
| `--sidebar-ring` | `oklch(0.708 0 0)` |

### 2.4 Radius Tokens

Base radius: `0.625rem` (10px). Turunan:

| Token | Formula | Nilai |
|---|---|---|
| `--radius-sm` | `base × 0.6` | 6px |
| `--radius-md` | `base × 0.8` | 8px |
| `--radius-lg` | `base` | 10px |
| `--radius-xl` | `base × 1.4` | 14px |
| `--radius-2xl` | `base × 1.8` | 18px |
| `--radius-3xl` | `base × 2.2` | 22px |
| `--radius-4xl` | `base × 2.6` | 26px |

### 2.5 Paper Colors (Preview Only)

Warna khusus untuk paper preview — **tidak** menggunakan Tailwind tokens.

| Nama | Value | Deskripsi |
|---|---|---|
| Paper BG | `#ffffff` | Background kertas |
| Border | `#111111` | Border tabel dan garis |
| Header BG | `#f5f5f5` | Background section header |
| Text | `#111111` | Teks di atas kertas |
| Placeholder | `#9ca3af` | Teks placeholder |
| Photo BG | `#f3f4f6` | Background area foto |

---

## 3. Typography

### 3.1 Font Families

Didefinisikan via `next/font/google` di `src/app/layout.tsx`:

| Font | Variable | Subset | Usage |
|---|---|---|---|
| Inter | `--font-inter` | latin | UI Latin, angka, simbol |
| Noto Sans JP | `--font-noto-jp` | latin, japanese | Teks Jepang (漢字, ひらがな, カタカナ) |

**Stack**: `font-sans` → Inter → Noto Sans JP → system fallback

### 3.2 Font Weights

| Weight | Usage |
|---|---|
| 400 (regular) | Body text, form labels, deskripsi |
| 500 (medium) | Card titles, step labels, tombol |
| 700 (bold) | Section headings, judul utama |

### 3.3 Font Sizes

#### UI Typography

| Token | Tailwind Class | Nilai |
|---|---|---|
| Base | `text-sm` | 14px (md: 13px) |
| Small | `text-xs` | 12px |
| Large | `text-base` | 16px |
| Heading | `text-lg` | 18px |

#### Paper Typography

| Penggunaan | Nilai | Catatan |
|---|---|---|
| Title (氏名) | 28px | Bold, centered |
| Base text | 13px | Normal body text |
| Furigana | 10px | Ruby annotation |
| Min size | 10px | Floor untuk semua teks |
| Line height | 1.5 | Multiplier |

### 3.4 Japanese Text Handling

- Gunakan `Noto Sans JP` untuk semua teks Jepang
- Furigana (ruby text) menggunakan `Furigana Size: 10px`
- Placeholder text untuk input Jepang menggunakan warna `muted-foreground`
- Input mode: `inputMode="numeric"` untuk nomor telepon, kode pos
- Input mode: `inputMode="email"` untuk email

---

## 4. Spacing & Layout

### 4.1 Grid System

Semua spacing berbasis **8px grid**:

| Token | Tailwind | Nilai |
|---|---|---|
| xs | `gap-1` / `p-1` | 4px |
| sm | `gap-1.5` / `p-1.5` | 6px |
| md | `gap-2` / `p-2` | 8px |
| lg | `gap-3` / `p-3` | 12px |
| xl | `gap-4` / `p-4` | 16px |
| 2xl | `gap-6` / `p-6` | 24px |
| 3xl | `gap-8` / `p-8` | 32px |

### 4.2 Page Layout

```
Mobile (375px):
┌─────────────────────┐
│  px-4 (16px)        │
│  ┌─────────────────┐│
│  │   Content       ││
│  │   max-w-5xl     ││
│  └─────────────────┘│
│  pb-20 (80px)       │ ← fixed bottom nav clearance
└─────────────────────┘

Desktop (768px+):
┌──────────────────────────────────┐
│     px-6 (24px)                  │
│  ┌──────────────────────────────┐│
│  │       Content                ││
│  │       max-w-5xl mx-auto      ││
│  └──────────────────────────────┘│
│  pb-4 (16px)                     │
└──────────────────────────────────┘
```

### Container widths (A-24)

| Region | Token | Derivation |
|---|---|---|
| Container (form, Step 1–4) | `max-w-5xl` (1024px) | grid 2-kolom field ~325px, row 4-kolom ~235px |
| Container (preview, Step 5) | `max-w-6xl` (1152px) | paper 794 + sidebar 280 + gap 24 + padding 48 = 1146 |
| Reading measure | Textarea 志望動機/本人希望 `max-w-3xl` (768px, ≈55 字/baris) | wide chrome, constrained prose |
| Step 1 grid | `md:grid-cols-[280px_1fr]` | foto fixed, fields fluid |

Changelog: 4xl → 5xl (A-24). 896px menyisakan 512px/sisi di 1920px; 1024px adalah sweet spot — 6xl untuk form membuat select 350–400px (over-shoot). Jangan kembalikan ke 4xl.


### 4.3 Component Spacing Patterns

| Context | Spacing |
|---|---|
| Card → Card | `space-y-6` (24px) |
| Card header → content | `gap-1` (4px) |
| Form fields | `space-y-5` (20px) |
| Grid columns (2-col) | `gap-4` (16px) |
| Button groups | `gap-2` (8px) |
| Step indicator → content | `py-4` (16px) |

---

## 5. Paper Specification

### 5.1 Dimensions (JIS A4-2019)

| Property | Value | Notes |
|---|---|---|
| Width | 794px | 210mm × 96dpi |
| Height | 1123px | 297mm × 96dpi |
| Outer Margin | 40px | 10.6mm di setiap sisi |
| Aspect Ratio | 1:√2 | Standar A4 |

### 5.2 Paper Layout Grid

```
┌─────────────────────────────────┐
│←40px→┌───────────────────┐←40px→│
│      │                   │      │
│      │   Content Area    │      │
│      │   714 × 1043px    │      │
│      │                   │      │
│←40px→└───────────────────┘←40px→│
└─────────────────────────────────┘
```

### 5.3 Photo Specification

| Property | Value |
|---|---|
| Physical size | 30×40mm (3:4 ratio) |
| Pixel size | 600×800px |
| Processing | Client-side Canvas API |
| Output format | dataURL (PNG) |
| Background | `#f3f4f6` |

### 5.4 Paper Typography

| Element | Font Size | Weight | Alignment |
|---|---|---|---|
| Name (氏名) | 28px | 700 (bold) | Center |
| Furigana | 10px | 400 | Center (above name) |
| Section headers | 13px | 500 (medium) | Left |
| Body text | 13px | 400 | Left |
| Date fields | 13px | 400 | Center |

---

## 6. Component Design Patterns

### 6.1 Wizard Shell

Container utama yang mengatur alur 5-step wizard.

```
WizardShell
├── StepIndicator (nav)
├── Step Content (dynamic)
│   ├── Step1BasicInfo
│   ├── Step2History
│   ├── Step3Licenses
│   ├── Step4Preferences
│   └── Step5Preview
└── WizardNav (footer)
```

**State management:**
- `currentStep: number` — langkah aktif (0-4)
- `visitedSteps: Set<number>` — langkah yang pernah dikunjungi
- Form state via `react-hook-form` + `zod` validation
- Draft auto-save ke `localStorage` via debounced write

### 6.2 Step Indicator

Desktop: horizontal stepper dengan number/circle + connecting lines.
Mobile: progress bar dengan counter `{n}/{total}`.

| State | Desktop Style | Mobile Style |
|---|---|---|
| Completed | Filled circle + check icon | Progress bar filled |
| Current | Outlined circle, border-primary | Progress bar partial |
| Future | Muted circle | Muted background |

### 6.3 Form Fields

```tsx
<FormField
  label="Label"           // Required
  hint="Optional hint"    // Optional, rendered muted
  error="Error message"   // Optional, renders error + aria-invalid
  htmlFor="custom-id"     // Optional, auto-generated if omitted
/>
```

**Layout patterns:**
- Single column: `grid-cols-1`
- Two columns: `grid-cols-1 md:grid-cols-2 gap-4`
- Photo + form: `grid-cols-1 md:grid-cols-[280px_1fr] gap-6`
- Alternate contact: `pl-6 border-l-2 border-muted` (indented)

### 6.4 Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* form fields */}
  </CardContent>
</Card>
```

**Card anatomy:**
- Border: `ring-1 ring-foreground/10`
- Border radius: `rounded-xl`
- Spacing: `--card-spacing` (default 16px, sm: 12px)
- Background: `bg-card` (white)

### 6.5 Buttons

#### Variants

| Variant | Usage | Style |
|---|---|---|
| `default` | Primary actions (Next, Submit) | bg-primary, text-white |
| `outline` | Secondary actions (Back) | bordered, bg-background |
| `ghost` | Tertiary actions (Delete icon) | no border, hover bg-muted |
| `destructive` | Destructive actions (Reset) | bg-destructive/10, text-destructive |
| `link` | Text links | underline on hover |

#### Sizes

| Size | Height | Usage |
|---|---|---|
| `xs` | 24px | Inline badges |
| `sm` | 28px | Compact forms, photo buttons |
| `default` | 32px | Standard actions |
| `lg` | 36px | Prominent actions |

#### Focus State

```
focus-visible:border-ring
focus-visible:ring-3
focus-visible:ring-ring/50
```

### 6.6 Navigation Bar

**Desktop:** Top bar with border-top, flex layout, save status left, buttons right.

**Mobile:** Fixed bottom bar (`fixed bottom-0`), 56px height, z-50.
- Back button: `flex-1 h-11`
- Next button: `flex-[2] h-11` (wider)

---

## 7. Print Stylesheet

### 7.1 Requirements

- Output: **tepat 1 halaman A4** (210×297mm)
- Browser target: Chrome "Save as PDF"
- Font: harus render tanpa tofu (□□□) untuk karakter Jepang

### 7.2 Paper Rendering

Paper preview dirender sebagai div dengan dimensi fixed:
- `width: 794px; height: 1123px`
- `overflow: hidden`
- Scale transform untuk responsif di viewport

### 7.3 Print QA Checklist

Sebelum setiap release, verifikasi:

**Chrome (Windows/macOS):**
- [ ] PDF tepat 1 halaman A4
- [ ] Font Jepang render tanpa tofu
- [ ] Section header bg `#f5f5f5` muncul
- [ ] Semua border tabel terlihat (1px solid #111)
- [ ] Foto muncul jika di-upload, placeholder jika tidak
- [ ] Teks wrap dengan benar di cell, tidak overflow
- [ ] Tidak ada halaman kosong ekstra

**Safari (macOS):**
- [ ] PDF output reasonable
- [ ] Font fallback: Hiragino/Yu Gothic

**Firefox:**
- [ ] PDF output acceptable
- [ ] Dokumentasi `@page` limitations

### 7.4 Edge Cases

- Empty draft (placeholder) → tidak crash
- Full draft (20+ history rows) → page 2 jika diperlukan, tanpa overflow
- Long text in motivation → wrap dengan benar
- Tidak ada foto → gray placeholder box render

### 7.5 Launch Asset Checklist (FR-18)

Semua asset statis, background `#fafaf9`, teks `#1c1917`, tanpa foto/data pengguna:

| Asset | Path | Ukuran | Dipakai untuk |
|---|---|---|---|
| OG image | `public/og-image.png` | 1200×630 | `og:image` / Twitter card (`SEO.ogImage`) |
| App icon | `src/app/icon.png` | 512×512 | Favicon + `<link rel="icon">` via Next metadata routes |
| GitHub social preview | `docs/assets/social-preview.png` | 1280×640 | Repo Settings → Social preview (upload manual) |

- [ ] Ukuran piksel persis sesuai tabel
- [ ] OG image memuat 履歴書 + headline "Buat CV Jepang Gratis"
- [ ] Icon terbaca pada 16px dan 32px (kontras tinggi, rounded square)

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Behavior |
|---|---|---|
| Mobile | 375px–767px | Single column, fixed bottom nav |
| Tablet | 768px–1023px | Two column form, top nav |
| Desktop | 1024px+ | Full layout, max-w-5xl centered (form), max-w-6xl (preview) |

### 8.1 Mobile (< 768px)

- Step indicator: progress bar (bukan stepper)
- Navigation: fixed bottom bar
- Photo upload: full width, aspect-ratio 3/4
- Form grids: single column
- Cards: stacked vertically

### 8.2 Tablet (768px+)

- Step indicator: horizontal stepper
- Navigation: top bar (inline)
- Photo upload: sticky sidebar (280px)
- Form grids: 2 columns
- Cards: side-by-side where appropriate

---

## 9. Iconography

### 9.1 Library

**lucide-react** — lightweight, tree-shakeable icons.

### 9.2 Icon Sizes

| Context | Size | Tailwind |
|---|---|---|
| Button icon | 16px | `h-4 w-4` |
| Step check | 16px | `h-4 w-4` |
| Photo placeholder | 40px | `h-10 w-10` |
| Loading spinner | 24px | `h-6 w-6` |

### 9.3 Common Icons

| Icon | Usage |
|---|---|
| `Check` | Step completion indicator |
| `Camera` | Photo upload placeholder |
| `Trash2` | Delete photo |
| `Loader2` | Processing spinner (with `animate-spin`) |
| `ArrowLeft` / `ArrowRight` | Navigation (optional) |

---

## 10. Motion & Animation

### 10.1 Library

**tw-animate-css** — Tailwind CSS animation utilities.

### 10.2 Animations Used

| Animation | Class | Usage |
|---|---|---|
| Spin | `animate-spin` | Loading spinner (Loader2) |
| Progress bar | `transition-all duration-300` | Step progress bar width |
| Focus ring | `transition-colors` | Input/button focus state |
| Page scroll | `scrollTo({ behavior: 'smooth' })` | Step navigation |

### 10.3 Transitions

| Property | Duration | Usage |
|---|---|---|
| `transition-colors` | default (150ms) | Button hover, input focus |
| `transition-all` | default | Progress bar width changes |
| `duration-300` | 300ms | Step indicator progress |

---

## 11. Accessibility

### 11.1 Keyboard Navigation

- Semua interactive elements harus reachable via Tab
- Step indicator: button untuk setiap step (disabled jika belum visited)
- Form fields: `htmlFor` + `id` pairing untuk label-input
- Focus visible: `focus-visible:ring-3 focus-visible:ring-ring/50`

### 11.2 ARIA Attributes

| Element | Attribute | Value |
|---|---|---|
| Step nav | `aria-label` | `"Progress"` |
| Error messages | `role` | `"alert"` |
| Invalid inputs | `aria-invalid` | `true` |
| Error descriptions | `aria-describedby` | `{id}-error` |
| Disabled buttons | `disabled` | boolean |

### 11.3 Color Contrast

Semua warna text harus memenuhi WCAG AA (4.5:1 minimum):

| Foreground | Background | Ratio | Status |
|---|---|---|---|
| `--foreground` (0.145) | `--background` (1.0) | ~16:1 | ✅ AAA |
| `--muted-foreground` (0.556) | `--background` (1.0) | ~5:1 | ✅ AA |
| `--primary-foreground` (0.985) | `--primary` (0.205) | ~14:1 | ✅ AAA |
| `--destructive` (0.577) | `--background` (1.0) | ~4.6:1 | ✅ AA |

### 11.4 Screen Reader Support

- Step indicator announces current step via semantic HTML (`<nav>`, `<ol>`, `<li>`)
- Form errors announced via `role="alert"` on error paragraphs
- Photo upload: `alt="証明写真"` on preview image
- Button states: disabled buttons have `disabled` attribute

### 11.5 Language

- `<html lang="ja">` — primary language Japanese
- Content mixed: Japanese UI labels, Indonesian metadata (`description`)
- Font loading: `next/font/google` with `subsets: ['latin']` + Japanese subset

---

## 12. Tech Stack Summary

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, RSC) |
| Styling | Tailwind CSS v4 + shadcn/ui v4 |
| Components | Base UI primitives (shadcn base-nova) |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Animations | tw-animate-css |
| Toast | sonner |
| Theme | next-themes (light-only, `enableSystem={false}`) |
| Fonts | Inter + Noto Sans JP (next/font/google) |
| State | Client-side localStorage (draft persistence) |

---

## 13. File Structure Reference

```
src/
├── app/
│   ├── globals.css          ← Design tokens, CSS variables
│   └── layout.tsx           ← Font loading, theme provider
├── components/
│   ├── preview/
│   │   └── paper-constants.ts  ← Paper dimensions & colors
│   ├── ui/                  ← shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form-field.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── ...
│   └── wizard/
│       ├── wizard-shell.tsx     ← Main wizard container
│       ├── wizard-nav.tsx       ← Navigation buttons
│       ├── step-indicator.tsx   ← Progress stepper
│       ├── photo-upload.tsx     ← Photo upload component
│       └── steps/
│           ├── step1-basic-info.tsx
│           ├── step2-history.tsx
│           ├── step3-licenses.tsx
│           ├── step4-preferences.tsx
│           └── step5-preview.tsx
└── lib/
    ├── constants/           ← Strings, prefectures, sample data
    ├── schema/              ← Zod validation schemas
    ├── storage/             ← localStorage draft persistence
    └── utils/               ← Utility functions
```

---

*Terakhir diperbarui: 2026-09-12*
