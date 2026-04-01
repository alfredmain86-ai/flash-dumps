'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui';
import type { DashboardStats } from '@/types';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, TIME_SLOT_INFO } from '@/types';
import { useAdminStore } from '@/store/admin';
import { MOCK_DASHBOARD_STATS } from '@/lib/mock-data';
import { formatCurrency, formatPhone } from '@/lib/constants';
import {
  DollarSign, TrendingUp, CalendarDays, FileText, Truck, Clock,
  Plus, Search, Phone, MapPin, Receipt,
} from 'lucide-react';

function statusToBadgeVariant(status: string) {
  const map: Record<string, 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'warning' | 'default'> = {
    scheduled: 'pending', confirmed: 'confirmed', en_route: 'in-progress',
    arrived: 'in-progress', loading: 'in-progress', completed: 'completed',
    cancelled: 'cancelled', new: 'warning', reviewed: 'default', priced: 'default',
    sent: 'confirmed', accepted: 'completed', booked: 'confirmed', expired: 'cancelled',
  };
  return map[status] ?? 'default';
}

const statCards: { label: string; key: keyof DashboardStats; icon: typeof DollarSign; format: string; iconBg: string; iconColor: string; href: string }[] = [
  { label: "Today's Revenue", key: 'todayRevenue', icon: DollarSign, format: 'currency', iconBg: 'bg-[#22C55E]/10', iconColor: 'text-[#22C55E]', href: '/admin/finances?period=today' },
  { label: 'Week Revenue', key: 'weekRevenue', icon: TrendingUp, format: 'currency', iconBg: 'bg-[#3B82F6]/10', iconColor: 'text-[#3B82F6]', href: '/admin/finances?period=week' },
  { label: 'Month Revenue', key: 'monthRevenue', icon: DollarSign, format: 'currency', iconBg: 'bg-[#8B5CF6]/10', iconColor: 'text-[#8B5CF6]', href: '/admin/finances?period=month' },
  { label: 'Pending Quotes', key: 'pendingQuotes', icon: FileText, format: 'number', iconBg: 'bg-[#FFB800]/10', iconColor: 'text-[#FFB800]', href: '/admin/quotes?status=new' },
  { label: "Today's Bookings", key: 'todayBookings', icon: CalendarDays, format: 'number', iconBg: 'bg-[#FF6B00]/10', iconColor: 'text-[#FF6B00]', href: '/admin/schedule?view=day' },
  { label: 'Truck Utilization', key: 'truckUtilization', icon: Truck, format: 'percent', iconBg: 'bg-[#A855F7]/10', iconColor: 'text-[#A855F7]', href: '/admin/trucks' },
];

function formatStatValue(value: number, format: string) {
  if (format === 'currency') return formatCurrency(value);
  if (format === 'percent') return `${value}%`;
  return value.toString();
}

export default function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS;
  const { bookings, quotes } = useAdminStore();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.scheduled_date === todayStr);
  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-white/50 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <section aria-label="Quick actions" className="flex flex-wrap gap-2">
        <Link
          href="/admin/quotes/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#E55F00] text-white text-xs font-semibold min-h-[40px] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          New Quote
        </Link>
        <Link
          href="/admin/bookings/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold min-h-[40px] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          New Booking
        </Link>
        <Link
          href="/admin/customers/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-semibold min-h-[40px] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          New Customer
        </Link>
        <Link
          href="/admin/finances?action=add-expense"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/70 text-xs font-semibold min-h-[40px] transition-colors"
        >
          <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
          Add Expense
        </Link>
      </section>

      {/* Stats grid — clickable */}
      <section aria-label="Key metrics" className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-white/50 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="mt-1.5 text-xl font-bold text-[#E8E4DF]">
                    {formatStatValue(stats[card.key], card.format)}
                  </p>
                </div>
                <div className={`rounded-xl p-2 ${card.iconBg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} aria-hidden="true" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5" aria-label="Today's schedule">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FF6B00]" aria-hidden="true" />
              Today&apos;s Schedule
            </h2>
            <Link href="/admin/schedule?view=day" className="text-xs text-[#FF6B00] hover:underline">View all</Link>
          </div>

          {todayBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/30 text-sm mb-3">No bookings for today</p>
              <Link href="/admin/bookings/new" className="text-xs text-[#FF6B00] hover:underline">Schedule a job</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todayBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {booking.customer?.name ?? 'Unknown'}
                        </span>
                        <Badge variant={statusToBadgeVariant(booking.status)}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Address — clickable maps link */}
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-white/40 hover:text-[#FF6B00] transition-colors mb-1"
                        aria-label={`Navigate to ${booking.address}`}
                      >
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{booking.address}</span>
                      </a>

                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span>{TIME_SLOT_INFO[booking.time_slot]?.label}</span>
                        <span>{booking.waste_types.map((wt) => WASTE_TYPE_INFO[wt]?.icon).join(' ')}</span>
                        <span>{LOAD_SIZE_INFO[booking.load_size]?.label}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{formatCurrency(booking.estimated_price)}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{booking.truck?.name ?? '—'}</p>
                      {/* Call button */}
                      {booking.customer?.phone && (
                        <a
                          href={`tel:${booking.customer.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-[#FF6B00] hover:underline"
                          aria-label={`Call ${booking.customer.name}`}
                        >
                          <Phone className="h-3 w-3" aria-hidden="true" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Quotes */}
        <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5" aria-label="Recent quotes">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#FFB800]" aria-hidden="true" />
              Recent Quotes
            </h2>
            <Link href="/admin/quotes" className="text-xs text-[#FF6B00] hover:underline">View all</Link>
          </div>

          <div className="space-y-2">
            {recentQuotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/admin/quotes/${quote.id}`}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.06] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm truncate">{quote.customer_name}</span>
                    <Badge variant={statusToBadgeVariant(quote.status)}>{quote.status}</Badge>
                    {quote.is_emergency && <Badge variant="cancelled">URGENT</Badge>}
                  </div>
                  <p className="text-xs text-white/40 truncate">{quote.reference} &middot; {quote.address}</p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className="text-sm font-semibold">${quote.estimated_price_min}–${quote.estimated_price_max}</p>
                  <p className="text-[10px] text-white/30">{new Date(quote.created_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
