import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-jp',
});

export const metadata: Metadata = {
  title: '履歴書メーカー | Buat CV Jepang Gratis',
  description: 'Buat resume Jepang (rirekisho / 履歴書) format JIS langsung dari browser. Gratis, tanpa akun, data 100% di perangkatmu.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`} suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' https://fonts.gstatic.com; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
        />
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
