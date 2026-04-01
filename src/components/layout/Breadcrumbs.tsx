'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const LABEL_MAP: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  schedule: 'Schedule',
  quotes: 'Quotes',
  customers: 'Customers',
  trucks: 'Trucks',
  pricing: 'Pricing',
  finances: 'Finances',
  bookings: 'Bookings',
  new: 'New',
  edit: 'Edit',
  analytics: 'Analytics',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on dashboard root
  if (segments.length <= 2 && segments[1] === 'dashboard') return null;

  const crumbs = segments.map((segment, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = LABEL_MAP[segment] || (segment.startsWith('cust-') || segment.startsWith('book-') || segment.startsWith('quote-')
      ? `#${segment.split('-').pop()}`
      : segment.charAt(0).toUpperCase() + segment.slice(1));
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-white/40">
        <li>
          <Link
            href="/admin/dashboard"
            className="hover:text-white/70 transition-colors p-1"
            aria-label="Dashboard home"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </li>
        {crumbs.slice(1).map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-white/20" aria-hidden="true" />
            {crumb.isLast ? (
              <span className="text-white/70 font-medium" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="hover:text-white/70 transition-colors">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
