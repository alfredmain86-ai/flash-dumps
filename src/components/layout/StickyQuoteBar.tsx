'use client';

import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import {
  COMPANY_PHONE,
  COMPANY_WHATSAPP,
  formatPhone,
} from '@/lib/constants';
import { t } from '@/lib/i18n';
import { useLocaleStore } from '@/store/locale';

export default function StickyQuoteBar() {
  const { locale } = useLocaleStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#1A1A1A] border-t-2 border-[#FF6B00] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-stretch min-h-[56px]">
        {/* Phone */}
        <a
          href={`tel:${COMPANY_PHONE}`}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[72px] min-h-[44px] px-4 py-2 text-white/80 hover:text-white active:bg-white/5 transition-colors"
          aria-label="Call us"
        >
          <Phone className="h-5 w-5" />
          <span className="text-[10px] font-medium">Call</span>
        </a>

        {/* Get Quote — center, orange */}
        <Link
          href="/quote"
          className="flex-1 flex items-center justify-center gap-2 min-h-[44px] bg-[#FF6B00] px-4 py-3 text-sm font-bold text-white tracking-wide hover:bg-[#E55F00] active:bg-[#D45500] transition-colors"
        >
          {t('nav.quote', locale)}
        </Link>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${COMPANY_WHATSAPP.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[72px] min-h-[44px] px-4 py-2 text-green-400 hover:text-green-300 active:bg-white/5 transition-colors"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
