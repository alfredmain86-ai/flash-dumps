'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Truck,
  DollarSign,
  Settings,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/schedule', label: 'Schedule', icon: Calendar },
  { href: '/admin/quotes', label: 'Quotes', icon: FileText },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/trucks', label: 'Trucks', icon: Truck },
  { href: '/admin/pricing', label: 'Pricing', icon: Settings },
  { href: '/admin/finances', label: 'Finances', icon: DollarSign },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard' || pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="hidden lg:flex fixed top-0 left-0 z-40 h-screen w-60 bg-[#0A0A0A] border-r border-white/[0.06] flex-col"
      aria-label="Admin navigation"
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5" aria-label="Go to dashboard">
          <Image
            src="/logo-icon.png"
            alt="Flash Dumps logo"
            width={40}
            height={40}
            className="h-8 w-8 rounded"
          />
          <div>
            <span className="text-lg font-extrabold tracking-tight text-[#FF6B00]">FLASH</span>
            <span className="text-lg font-extrabold tracking-tight text-white"> DUMPS</span>
          </div>
        </Link>
        <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6B00]/80">
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Admin menu">
        {sidebarLinks.map((link, index) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          const showSeparator = index === 5;

          return (
            <div key={link.href}>
              {showSeparator && (
                <div className="my-3 border-t border-white/5" role="separator" />
              )}
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative
                  min-h-[44px]
                  ${
                    active
                      ? 'bg-white/[0.06] text-white before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-[#FF6B00]'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  }
                `}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-[#FF6B00]' : ''}`} aria-hidden="true" />
                {link.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-[11px] text-white/30 font-medium">
          Flash Dumps Admin v1.0
        </p>
      </div>
    </aside>
  );
}
