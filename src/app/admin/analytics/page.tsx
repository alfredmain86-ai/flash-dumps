'use client';

import { useMemo } from 'react';
import { useAdminStore } from '@/store/admin';
import { formatCurrency } from '@/lib/constants';
import {
  TrendingUp, Users, FileText, Truck, Calendar, DollarSign,
  BarChart3, ArrowRight, Repeat,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { bookings, quotes, customers, trucks } = useAdminStore();

  const completed = useMemo(() => bookings.filter((b) => b.status === 'completed'), [bookings]);
  const totalRevenue = completed.reduce((s, b) => s + (b.final_price ?? b.estimated_price), 0);

  // Quote-to-booking conversion
  const acceptedQuotes = quotes.filter((q) => ['accepted', 'booked'].includes(q.status)).length;
  const conversionRate = quotes.length > 0 ? ((acceptedQuotes / quotes.length) * 100).toFixed(1) : '0';

  // Revenue per truck
  const revenueByTruck = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; jobs: number }> = {};
    for (const t of trucks) map[t.id] = { name: t.name, revenue: 0, jobs: 0 };
    for (const b of completed) {
      if (b.truck_id && map[b.truck_id]) {
        map[b.truck_id].revenue += b.final_price ?? b.estimated_price;
        map[b.truck_id].jobs++;
      }
    }
    return Object.values(map);
  }, [completed, trucks]);

  // Revenue by week (last 4 weeks)
  const weeklyRevenue = useMemo(() => {
    const weeks: { label: string; revenue: number; jobs: number }[] = [];
    for (let w = 0; w < 4; w++) {
      const start = new Date();
      start.setDate(start.getDate() - (w + 1) * 7);
      const end = new Date();
      end.setDate(end.getDate() - w * 7);
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      const weekBookings = completed.filter((b) => b.scheduled_date >= startStr && b.scheduled_date < endStr);
      weeks.push({
        label: `Week ${4 - w}`,
        revenue: weekBookings.reduce((s, b) => s + (b.final_price ?? b.estimated_price), 0),
        jobs: weekBookings.length,
      });
    }
    return weeks.reverse();
  }, [completed]);

  const maxWeekRevenue = Math.max(...weeklyRevenue.map((w) => w.revenue), 1);

  // Revenue by customer (top 5)
  const topCustomers = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; jobs: number }> = {};
    for (const b of completed) {
      const name = b.customer?.name ?? 'Unknown';
      if (!map[b.customer_id]) map[b.customer_id] = { name, revenue: 0, jobs: 0 };
      map[b.customer_id].revenue += b.final_price ?? b.estimated_price;
      map[b.customer_id].jobs++;
    }
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [completed]);

  // Repeat customer rate
  const customerJobCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of completed) map[b.customer_id] = (map[b.customer_id] || 0) + 1;
    const total = Object.keys(map).length;
    const repeat = Object.values(map).filter((c) => c > 1).length;
    return { total, repeat, rate: total > 0 ? ((repeat / total) * 100).toFixed(0) : '0' };
  }, [completed]);

  // Avg revenue per job
  const avgRevenue = completed.length > 0 ? totalRevenue / completed.length : 0;

  // Revenue per truck per day (last 30 days)
  const revPerTruckPerDay = useMemo(() => {
    const days = 30;
    return revenueByTruck.map((t) => ({
      ...t,
      perDay: days > 0 ? t.revenue / days : 0,
    }));
  }, [revenueByTruck]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-white/50 text-sm mt-0.5">Business intelligence and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-[#22C55E]' },
          { label: 'Completed Jobs', value: String(completed.length), icon: Calendar, color: 'text-white' },
          { label: 'Avg Job Value', value: formatCurrency(avgRevenue), icon: TrendingUp, color: 'text-[#3B82F6]' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, icon: ArrowRight, color: 'text-[#FF6B00]' },
          { label: 'Repeat Rate', value: `${customerJobCounts.rate}%`, icon: Repeat, color: 'text-[#A855F7]' },
          { label: 'Active Customers', value: String(customerJobCounts.total), icon: Users, color: 'text-[#FFB800]' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className={`h-3.5 w-3.5 ${kpi.color}`} aria-hidden="true" />
                <span className="text-[10px] text-white/50 uppercase tracking-wide">{kpi.label}</span>
              </div>
              <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5" aria-label="Weekly revenue">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#FF6B00]" aria-hidden="true" />
            Weekly Revenue (Last 4 Weeks)
          </h2>
          <div className="space-y-3">
            {weeklyRevenue.map((w) => (
              <div key={w.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{w.label}</span>
                  <span className="text-sm font-semibold text-[#22C55E]">{formatCurrency(w.revenue)}</span>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#FF6B00] to-[#FFB800] h-3 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${Math.max((w.revenue / maxWeekRevenue) * 100, 5)}%` }}
                  >
                    <span className="text-[9px] font-bold text-white">{w.jobs} jobs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conversion Funnel */}
        <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5" aria-label="Conversion funnel">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#FFB800]" aria-hidden="true" />
            Quote → Booking Funnel
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Total Quotes', count: quotes.length, pct: 100, color: 'bg-[#3B82F6]' },
              { label: 'Reviewed', count: quotes.filter((q) => !['new'].includes(q.status)).length, pct: quotes.length > 0 ? (quotes.filter((q) => !['new'].includes(q.status)).length / quotes.length) * 100 : 0, color: 'bg-[#A855F7]' },
              { label: 'Sent to Customer', count: quotes.filter((q) => ['sent', 'accepted', 'booked'].includes(q.status)).length, pct: quotes.length > 0 ? (quotes.filter((q) => ['sent', 'accepted', 'booked'].includes(q.status)).length / quotes.length) * 100 : 0, color: 'bg-[#FFB800]' },
              { label: 'Accepted / Booked', count: acceptedQuotes, pct: quotes.length > 0 ? (acceptedQuotes / quotes.length) * 100 : 0, color: 'bg-[#22C55E]' },
            ].map((step) => (
              <div key={step.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{step.label}</span>
                  <span className="text-sm font-semibold">{step.count} ({step.pct.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-2">
                  <div className={`${step.color} h-2 rounded-full transition-all`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue by Truck */}
        <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5" aria-label="Revenue by truck">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#FF6B00]" aria-hidden="true" />
            Revenue by Truck
          </h2>
          <div className="space-y-4">
            {revPerTruckPerDay.map((t) => (
              <div key={t.name} className="rounded-xl bg-white/[0.03] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{t.name}</span>
                  <span className="text-sm font-bold text-[#22C55E]">{formatCurrency(t.revenue)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-white/50">
                  <div>{t.jobs} jobs completed</div>
                  <div className="text-right">{formatCurrency(t.perDay)}/day avg</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Customers */}
        <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5" aria-label="Top customers">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#A855F7]" aria-hidden="true" />
            Top Customers by Revenue
          </h2>
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white/30 w-5">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-white/40">{c.jobs} jobs</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#22C55E]">{formatCurrency(c.revenue)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
