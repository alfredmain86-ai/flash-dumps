'use client';

import { useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';
import { COMPANY_NAME } from '@/lib/constants';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/schedule', label: 'Schedule', icon: Calendar },
  { href: '/admin/quotes', label: 'Quotes', icon: FileText },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/trucks', label: 'Trucks', icon: Truck },
  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/admin/finances', label: 'Finances', icon: DollarSign },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-icon.png"
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 rounded"
          />
          <div>
            <span className="text-lg font-extrabold tracking-tight text-[#FF6B00]">
              FLASH
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">
              {' '}DUMPS
            </span>
          </div>
        </div>
        <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6B00]/80">
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
        {sidebarLinks.map((link, index) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          // Add separator before "Pricing" group
          const showSeparator = index === 5;

          return (
            <div key={link.href}>
              {showSeparator && (
                <div className="my-3 border-t border-white/5" />
              )}
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all relative
                  ${
                    active
                      ? 'bg-white/5 text-white before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-[#FF6B00]'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }
                `}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-[#FF6B00]' : ''}`} />
                {link.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-[11px] text-white/25 font-medium">
          {COMPANY_NAME} Admin
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 rounded-lg bg-[#0F0F0F] p-2 text-white shadow-lg"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-[#0F0F0F] text-white
          flex flex-col transition-transform duration-200 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
