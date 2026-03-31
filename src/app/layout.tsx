import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
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

export const metadata: Metadata = {
  title: "FLASH DUMPS | Miami's #1 Construction Debris Removal",
  description:
    'Flash Dumps provides premium construction debris hauling and removal services across Miami-Dade County. Same-day dumpster delivery, licensed & insured. Concrete, drywall, wood, metal, roofing, and mixed debris.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable} h-full`}>
      <body className="min-h-full font-body antialiased">{children}</body>
    </html>
  );
}
