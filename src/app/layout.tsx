import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import Script from 'next/script';
import PinGate from '@/components/PinGate';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const inter = Inter({
  variable: '--font-clash-display',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
});

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

export const metadata: Metadata = {
  title: "FLASH DUMPS | Miami's #1 Construction Debris Removal",
  description:
    'Flash Dumps provides premium construction debris hauling and removal services across Miami-Dade County. Same-day dumpster delivery, licensed & insured. Concrete, drywall, wood, metal, roofing, and mixed debris.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "FLASH DUMPS | Miami's #1 Construction Debris Removal",
    description: 'Premium construction debris hauling across Miami-Dade County. Same-day service, licensed & insured.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Flash Dumps',
  },
  robots: { index: true, follow: true },
};

// LocalBusiness structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Flash Dumps',
  description: 'Construction debris removal and hauling services in Miami-Dade County',
  telephone: '+13051234567',
  email: 'info@flashdumps.com',
  url: 'https://flashdumps.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Miami',
    addressRegion: 'FL',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.7617,
    longitude: -80.1918,
  },
  areaServed: {
    '@type': 'Place',
    name: 'Miami-Dade County, FL',
  },
  priceRange: '$200-$650',
  openingHours: 'Mo-Fr 07:00-18:00',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full font-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <PinGate>{children}</PinGate>
      </body>
    </html>
  );
}
