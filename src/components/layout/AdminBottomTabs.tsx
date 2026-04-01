'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  MoreHorizontal,
  Truck,
  DollarSign,
  Settings,
  BarChart3,
  X,
} from 'lucide-react';

const primaryTabs = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/schedule', label: 'Schedule', icon: Calendar },
  { href: '/admin/quotes', label: 'Quotes', icon: FileText },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

const moreTabs = [
  { href: '/admin/trucks', label: 'Trucks', icon: Truck },
  { href: '/admin/pricing', label: 'Pricing', icon: Settings },
  { href: '/admin/finances', label: 'Finances', icon: DollarSign },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminBottomTabs() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard' || pathname === '/admin';
    return pathname.startsWith(href);
  };

  const isMoreActive = moreTabs.some((t) => isActive(t.href));

  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [moreOpen]);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-white/[0.08]"
      aria-label="Admin navigation"
    >
      <div className="flex items-stretch justify-around">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-1 min-w-[64px] min-h-[56px] transition-colors ${
                active ? 'text-[#FF6B00]' : 'text-white/40'
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
            </Link>
          );
        })}

        {/* More button */}
        <div ref={moreRef} className="relative">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            aria-expanded={moreOpen}
            aria-label="More navigation options"
            className={`flex flex-col items-center justify-center gap-0.5 py-2 px-1 min-w-[64px] min-h-[56px] transition-colors ${
              isMoreActive || moreOpen ? 'text-[#FF6B00]' : 'text-white/40'
            }`}
          >
            {moreOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="text-[10px] font-medium leading-tight">More</span>
          </button>

          {/* More dropdown */}
          {moreOpen && (
            <div className="absolute bottom-full right-0 mb-2 mr-1 w-48 rounded-xl bg-[#1A1A1A] border border-white/[0.08] shadow-xl overflow-hidden">
              {moreTabs.map((tab) => {
                const Icon = tab.icon;
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setMoreOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium min-h-[44px] transition-colors ${
                      active
                        ? 'bg-white/[0.06] text-[#FF6B00]'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
