import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { JsonLd } from '@/components/seo/json-ld';
import { SEO } from '@/lib/constants/seo';
import { strings } from '@/lib/constants/strings';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: { default: SEO.title, template: '%s | Rirekisho Maker' },
  description: SEO.description,
  keywords: [...SEO.keywords],
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: './',
    siteName: SEO.siteName,
    title: SEO.ogTitle,
    description: SEO.ogDescription,
    images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.ogTitle,
    description: SEO.ogDescription,
    images: [SEO.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: SEO.themeColor };

const appJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: strings.seo.jsonLdAppName,
  url: SEO.siteUrl,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any (web browser)',
  inLanguage: 'id',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
  featureList: [
    'Format JIS 履歴書',
    'Tanpa akun, gratis selamanya',
    'Data tersimpan hanya di browser',
    'Export PDF via print',
  ],
  description: strings.seo.jsonLdAppDesc,
};

const faqJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: strings.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${notoSansJP.variable}`} suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-src 'none'; frame-ancestors 'none'"
        />
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        <JsonLd data={appJsonLd} />
        <JsonLd data={faqJsonLd} />
      </body>
    </html>
  );
}
