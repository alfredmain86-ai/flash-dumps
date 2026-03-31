'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { COMPANY_PHONE, formatPhone } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { useLocaleStore } from '@/store/locale';

function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const iconH = size === 'lg' ? 'h-14 w-14' : 'h-9 w-9';
  const textSize = size === 'lg' ? 'text-3xl' : 'text-xl';

  return (
    <span className="flex items-center gap-2">
      <Image
        src="/logo-icon.png"
        alt=""
        width={56}
        height={56}
        className={`${iconH} rounded-lg`}
        priority
      />
      <span className={`${textSize} font-extrabold tracking-tight leading-none`}>
        <span className="text-[#FF6B00]">FLASH</span>
        <span className="text-white"> DUMPS</span>
      </span>
    </span>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, toggle } = useLocaleStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home', locale) },
    { href: '/services', label: t('nav.services', locale) },
    { href: '/quote', label: t('nav.quote', locale) },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? 'bg-[#1A1A1A]/98 shadow-lg shadow-black/20'
            : 'bg-[#1A1A1A]/95'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Logo />
            </Link>

            {/* Desktop nav — center */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white hover:text-[#FF6B00] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right: phone + lang toggle + CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={`tel:${COMPANY_PHONE}`}
                className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-[#FF6B00] transition-colors"
              >
                <Phone className="h-4 w-4" />
                {formatPhone(COMPANY_PHONE)}
              </a>

              <button
                onClick={toggle}
                className="flex items-center gap-1 rounded-full border border-white/20 px-2.5 py-1 text-xs font-semibold text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                <Globe className="h-3 w-3" />
                {locale === 'en' ? 'ES' : 'EN'}
              </button>

              <Link
                href="/quote"
                className="rounded-lg bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#FF6B00]/20 hover:bg-[#E55F00] transition-colors"
              >
                {t('nav.quote', locale)}
              </Link>
            </div>

            {/* Mobile: lang toggle + hamburger */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={toggle}
                className="flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
              >
                <Globe className="h-3 w-3" />
                {locale === 'en' ? 'ES' : 'EN'}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-white p-1"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen overlay nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#1A1A1A] flex flex-col items-center justify-center md:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-white p-2"
            aria-label="Close menu"
          >
            <X className="h-7 w-7" />
          </button>

          <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <div className="mb-4">
              <Logo size="lg" />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-semibold text-white hover:text-[#FF6B00] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/quote"
              onClick={() => setMobileOpen(false)}
              className="mt-4 rounded-lg bg-[#FF6B00] px-8 py-3 text-lg font-semibold text-white hover:bg-[#E55F00] transition-colors"
            >
              {t('nav.quote', locale)}
            </Link>

            <a
              href={`tel:${COMPANY_PHONE}`}
              className="flex items-center gap-2 text-lg text-white/70 hover:text-[#FF6B00] transition-colors"
            >
              <Phone className="h-5 w-5" />
              {formatPhone(COMPANY_PHONE)}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
