import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'PatureNews | Berita Modern & Media Terpercaya',
  description: 'Platform berita minimalis untuk era modern yang mengutamakan kejernihan informasi.',
  metadataBase: new URL('https://paturenews.vercel.app'),
  openGraph: {
    title: 'PatureNews | Berita Modern & Media Terpercaya',
    description: 'Platform berita minimalis untuk era modern yang mengutamakan kejernihan informasi.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <FirebaseClientProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 w-full mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
