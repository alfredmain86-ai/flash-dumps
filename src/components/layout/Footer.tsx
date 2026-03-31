'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

import {
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_EMAIL,
  COMPANY_WHATSAPP,
  formatPhone,
} from '@/lib/constants';
import { t } from '@/lib/i18n';
import { useLocaleStore } from '@/store/locale';

export default function Footer() {
  const { locale } = useLocaleStore();

  const quickLinks = [
    { href: '/', label: t('nav.home', locale) },
    { href: '/services', label: t('nav.services', locale) },
    { href: '/quote', label: t('nav.quote', locale) },
    { href: '/login', label: t('nav.login', locale) },
  ];

  const services = [
    t('services.construction', locale),
    t('services.remodeling', locale),
    t('services.materials', locale),
    t('services.recurring', locale),
    t('services.emergency', locale),
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Image
                src="/logo-icon.png"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-[#FF6B00]">
                  FLASH
                </span>
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  {' '}DUMPS
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Miami&apos;s debris removal experts. Fast, reliable construction
              waste hauling for contractors and homeowners across Miami-Dade
              County.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#FF6B00] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              {t('services.title', locale)}
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li
                  key={service}
                  className="text-sm text-white/60"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#FF6B00] transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#FF6B00]" />
                  {formatPhone(COMPANY_PHONE)}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#FF6B00] transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#FF6B00]" />
                  {COMPANY_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-green-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-green-400" />
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin className="h-4 w-4 shrink-0 text-[#FF6B00] mt-0.5" />
                Miami-Dade County, FL
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-white/30 mb-1">Payment Methods</p>
              <p className="text-xs text-white/50">Cash, Zelle, Wire Transfer, Credit Card</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {COMPANY_NAME} LLC.{' '}
            {t('footer.rights', locale)}
          </p>
          <p className="text-xs text-white/30">
            {t('footer.serving', locale)}
          </p>
        </div>
      </div>
    </footer>
  );
}
