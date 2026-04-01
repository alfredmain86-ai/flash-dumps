'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyQuoteBar from '@/components/layout/StickyQuoteBar';
import { Toaster } from 'react-hot-toast';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#FAF8F5',
            borderRadius: '0.5rem',
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            border: '1px solid rgba(255, 107, 0, 0.2)',
          },
        }}
      />
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <StickyQuoteBar />
    </>
  );
}
