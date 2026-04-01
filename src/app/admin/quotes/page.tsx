'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import { useAdminStore } from '@/store/admin';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO } from '@/types';
import type { QuoteStatus } from '@/types';
import { formatCurrency } from '@/lib/constants';
import {
  Search, ChevronRight, AlertTriangle, Plus,
} from 'lucide-react';

type FilterTab = 'all' | QuoteStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Reviewed', value: 'reviewed' },
  { label: 'Sent', value: 'sent' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Expired', value: 'expired' },
];

function statusBadgeVariant(status: string) {
  const map: Record<string, 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'warning' | 'info' | 'default'> = {
    new: 'warning', reviewed: 'info', priced: 'info', sent: 'confirmed',
    accepted: 'completed', booked: 'confirmed', expired: 'cancelled',
  };
  return (map[status] ?? 'default') as 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'warning' | 'info' | 'default';
}

export default function QuotesPage() {
  const { quotes } = useAdminStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuotes = useMemo(() => {
    let result = [...quotes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (activeTab !== 'all') {
      result = result.filter((q) => q.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (qt) =>
          qt.customer_name.toLowerCase().includes(q) ||
          qt.address.toLowerCase().includes(q) ||
          qt.customer_email.toLowerCase().includes(q) ||
          qt.reference.toLowerCase().includes(q)
      );
    }

    return result;
  }, [quotes, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quotes</h1>
          <p className="text-white/50 text-sm mt-0.5">Manage and review quote requests</p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#E55F00] text-white text-xs font-semibold min-h-[40px] transition-colors self-start"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          New Quote
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search name, address, reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm placeholder:text-white/30"
          aria-label="Search quotes"
        />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 border-b border-white/[0.06]" role="tablist" aria-label="Quote status filter">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === 'all'
            ? quotes.length
            : quotes.filter((q) => q.status === tab.value).length;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 min-h-[44px] ${
                activeTab === tab.value
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-white/40 hover:text-white/60'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs bg-white/[0.06] text-white/40 rounded-full px-2 py-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Quotes list */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/[0.06] text-xs font-semibold text-white/40 uppercase tracking-wide">
          <div className="col-span-1">Ref</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Waste</div>
          <div className="col-span-1">Load</div>
          <div className="col-span-2">Address</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1"></div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 text-lg mb-3">No quotes found</p>
            <p className="text-sm text-white/20">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filteredQuotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/admin/quotes/${quote.id}`}
                className="block px-6 py-4 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center flex flex-col gap-2">
                  <div className="col-span-1 text-xs text-white/40 font-mono">{quote.reference.split('-').slice(1).join('-')}</div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium truncate group-hover:text-[#FF6B00] transition-colors">{quote.customer_name}</p>
                    <p className="text-xs text-white/30 truncate hidden lg:block">{quote.customer_email}</p>
                  </div>
                  <div className="col-span-2 text-sm text-white/50 truncate">
                    {quote.waste_types.map((wt) => WASTE_TYPE_INFO[wt]?.icon).join(' ')}{' '}
                    {quote.waste_types.length > 1
                      ? `${quote.waste_types.length} types`
                      : WASTE_TYPE_INFO[quote.waste_types[0]]?.label.split(' / ')[0]}
                  </div>
                  <div className="col-span-1 text-sm text-white/50">{LOAD_SIZE_INFO[quote.load_size]?.label}</div>
                  <div className="col-span-2 text-sm text-white/50 truncate">{quote.address}</div>
                  <div className="col-span-2 text-sm font-semibold">
                    ${quote.estimated_price_min}–${quote.estimated_price_max}
                    {quote.admin_adjusted_price && (
                      <span className="text-[#FF6B00] ml-1">(${quote.admin_adjusted_price})</span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center gap-1.5">
                    <Badge variant={statusBadgeVariant(quote.status)}>{quote.status}</Badge>
                    {quote.is_emergency && <AlertTriangle className="h-3.5 w-3.5 text-[#EF4444]" aria-label="Emergency" />}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-[#FF6B00] transition-colors" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
