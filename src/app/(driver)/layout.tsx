'use client';

import { Truck } from 'lucide-react';
import { COMPANY_NAME } from '@/lib/constants';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Top bar */}
      <header className="bg-[#1A1A1A] px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center">
            <Truck className="h-4.5 w-4.5 text-[#FF6B00]" />
          </div>
          <span className="font-extrabold text-sm tracking-tight">
            <span className="text-[#FF6B00]">FLASH</span>
            <span className="text-white ml-1">DUMPS</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-[#FF6B00] flex items-center justify-center text-[10px] font-bold text-white">
            JR
          </div>
          <span className="text-xs text-white/60 font-medium">Juan R.</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-8">{children}</main>
    </div>
  );
}
