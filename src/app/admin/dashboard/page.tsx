'use client';

import { Badge } from '@/components/ui';
import type { DashboardStats } from '@/types';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, TIME_SLOT_INFO } from '@/types';
import { MOCK_DASHBOARD_STATS, MOCK_BOOKINGS, MOCK_QUOTES } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/constants';
import {
  DollarSign,
  TrendingUp,
  CalendarDays,
  FileText,
  Truck,
  Clock,
} from 'lucide-react';

function statusToBadgeVariant(status: string) {
  const map: Record<string, 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'default'> = {
    scheduled: 'pending',
    confirmed: 'confirmed',
    en_route: 'in-progress',
    arrived: 'in-progress',
    loading: 'in-progress',
    completed: 'completed',
    cancelled: 'cancelled',
    new: 'pending',
    reviewed: 'default',
    priced: 'default',
    sent: 'confirmed',
    accepted: 'completed',
    booked: 'confirmed',
    expired: 'cancelled',
  };
  return map[status] ?? 'default';
}

const statCards = [
  {
    label: "Today's Revenue",
    key: 'todayRevenue' as keyof DashboardStats,
    icon: DollarSign,
    format: 'currency',
    iconBg: 'bg-[#22C55E]/10',
    iconColor: 'text-[#22C55E]',
  },
  {
    label: 'Week Revenue',
    key: 'weekRevenue' as keyof DashboardStats,
    icon: TrendingUp,
    format: 'currency',
    iconBg: 'bg-[#3B82F6]/10',
    iconColor: 'text-[#3B82F6]',
  },
  {
    label: 'Month Revenue',
    key: 'monthRevenue' as keyof DashboardStats,
    icon: DollarSign,
    format: 'currency',
    iconBg: 'bg-[#8B5CF6]/10',
    iconColor: 'text-[#8B5CF6]',
  },
  {
    label: 'Pending Quotes',
    key: 'pendingQuotes' as keyof DashboardStats,
    icon: FileText,
    format: 'number',
    iconBg: 'bg-[#FFB800]/10',
    iconColor: 'text-[#FFB800]',
  },
  {
    label: "Today's Bookings",
    key: 'todayBookings' as keyof DashboardStats,
    icon: CalendarDays,
    format: 'number',
    iconBg: 'bg-[#FF6B00]/10',
    iconColor: 'text-[#FF6B00]',
  },
  {
    label: 'Truck Utilization',
    key: 'truckUtilization' as keyof DashboardStats,
    icon: Truck,
    format: 'percent',
    iconBg: 'bg-[#A855F7]/10',
    iconColor: 'text-[#A855F7]',
  },
];

function formatStatValue(value: number, format: string) {
  if (format === 'currency') return formatCurrency(value);
  if (format === 'percent') return `${value}%`;
  return value.toString();
}

export default function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = MOCK_BOOKINGS.filter((b) => b.scheduled_date === todayStr);
  const recentQuotes = [...MOCK_QUOTES]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#E8E4DF]">Dashboard</h1>
        <p className="text-white/50 mt-1">
          Overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#E8E4DF]">
                    {formatStatValue(stats[card.key], card.format)}
                  </p>
                </div>
                <div className={`rounded-xl p-2.5 ${card.iconBg}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[#E8E4DF] flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#FF6B00]" />
              Today&apos;s Schedule
            </h2>
            <Badge variant="default">{todayBookings.length} bookings</Badge>
          </div>

          {todayBookings.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">
              No bookings scheduled for today.
            </p>
          ) : (
            <div className="space-y-3">
              {todayBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.06] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-[#E8E4DF] truncate">
                        {booking.customer?.name ?? 'Unknown'}
                      </p>
                      <Badge variant={statusToBadgeVariant(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/40 mt-1 truncate">
                      {booking.address}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-white/30">
                        {TIME_SLOT_INFO[booking.time_slot]?.label}
                      </span>
                      <span className="text-xs text-white/30">
                        {booking.waste_types.map((wt) => WASTE_TYPE_INFO[wt]?.icon).join(' ')}
                      </span>
                      <span className="text-xs text-white/30">
                        {LOAD_SIZE_INFO[booking.load_size]?.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-sm font-semibold text-[#E8E4DF]">
                      {formatCurrency(booking.estimated_price)}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {booking.truck?.name ?? 'Unassigned'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quotes */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[#E8E4DF] flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FFB800]" />
              Recent Quotes
            </h2>
            <Badge variant="default">{recentQuotes.length} latest</Badge>
          </div>

          <div className="space-y-3">
            {recentQuotes.map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.06] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-[#E8E4DF] truncate">
                      {quote.customer_name}
                    </p>
                    <Badge variant={statusToBadgeVariant(quote.status)}>
                      {quote.status}
                    </Badge>
                    {quote.is_emergency && (
                      <Badge variant="cancelled">URGENT</Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1 truncate">
                    {quote.address}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {quote.waste_types.map((wt) => WASTE_TYPE_INFO[wt]?.label).join(', ')}
                    {' - '}
                    {LOAD_SIZE_INFO[quote.load_size]?.label}
                  </p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-sm font-semibold text-[#E8E4DF]">
                    {formatCurrency(quote.estimated_price_min)} - {formatCurrency(quote.estimated_price_max)}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
