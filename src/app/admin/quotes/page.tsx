'use client';

import { useState, useMemo } from 'react';
import { Badge, Button } from '@/components/ui';
import { MOCK_QUOTES } from '@/lib/mock-data';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO } from '@/types';
import type { QuoteStatus } from '@/types';
import { formatCurrency } from '@/lib/constants';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  Send,
  DollarSign,
  AlertTriangle,
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

function statusToBadgeVariant(status: string) {
  const map: Record<string, 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'default'> = {
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

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredQuotes = useMemo(() => {
    let quotes = [...MOCK_QUOTES].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (activeTab !== 'all') {
      quotes = quotes.filter((q) => q.status === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      quotes = quotes.filter(
        (q) =>
          q.customer_name.toLowerCase().includes(query) ||
          q.address.toLowerCase().includes(query) ||
          q.customer_email.toLowerCase().includes(query) ||
          q.customer_phone.includes(query)
      );
    }

    return quotes;
  }, [activeTab, searchQuery]);

  const handleAction = (action: string, quoteId: string) => {
    alert(`Action: ${action} on quote ${quoteId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#E8E4DF]">Quotes</h1>
        <p className="text-white/50 mt-1">
          Manage and review customer quote requests
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, address, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#E8E4DF] text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/50"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 border-b border-white/[0.06]">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? MOCK_QUOTES.length
              : MOCK_QUOTES.filter((q) => q.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === tab.value
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-white/40 hover:text-white/60 hover:border-white/20'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs bg-white/[0.06] text-white/40 rounded-full px-2 py-0.5">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quotes list */}
      <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/[0.06] text-xs font-semibold text-white/40 uppercase tracking-wide">
          <div className="col-span-1">Date</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Waste Type</div>
          <div className="col-span-1">Load</div>
          <div className="col-span-2">Address</div>
          <div className="col-span-2">Price Range</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1"></div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <p className="text-lg">No quotes found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filteredQuotes.map((quote) => {
              const isExpanded = expandedId === quote.id;
              return (
                <div key={quote.id}>
                  {/* Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                    className="w-full text-left px-6 py-4 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <div className="lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center flex flex-col gap-2">
                      <div className="col-span-1 text-sm text-white/40">
                        {new Date(quote.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-[#E8E4DF] truncate">
                          {quote.customer_name}
                        </p>
                        <p className="text-xs text-white/30 truncate lg:block hidden">
                          {quote.customer_email}
                        </p>
                      </div>
                      <div className="col-span-2 text-sm text-white/50 truncate">
                        {quote.waste_types.map((wt) => WASTE_TYPE_INFO[wt]?.icon).join(' ')}{' '}
                        {quote.waste_types.length > 1
                          ? `${quote.waste_types.length} types`
                          : WASTE_TYPE_INFO[quote.waste_types[0]]?.label}
                      </div>
                      <div className="col-span-1 text-sm text-white/50">
                        {LOAD_SIZE_INFO[quote.load_size]?.label}
                      </div>
                      <div className="col-span-2 text-sm text-white/50 truncate">
                        {quote.address}
                      </div>
                      <div className="col-span-2 text-sm font-semibold text-[#E8E4DF]">
                        {formatCurrency(quote.estimated_price_min)} - {formatCurrency(quote.estimated_price_max)}
                      </div>
                      <div className="col-span-1 flex items-center gap-2">
                        <Badge variant={statusToBadgeVariant(quote.status)}>
                          {quote.status}
                        </Badge>
                        {quote.is_emergency && (
                          <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-white/30" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white/30" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-6 pb-6 bg-white/[0.02] border-t border-white/[0.04]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        {/* Contact info */}
                        <div>
                          <h4 className="text-xs font-semibold text-white/40 uppercase mb-2">
                            Contact Info
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-white/40">Name:</span>{' '}
                              <span className="text-[#E8E4DF]">{quote.customer_name}</span>
                            </p>
                            <p>
                              <span className="text-white/40">Email:</span>{' '}
                              <span className="text-[#E8E4DF]">{quote.customer_email}</span>
                            </p>
                            <p>
                              <span className="text-white/40">Phone:</span>{' '}
                              <span className="text-[#E8E4DF]">{quote.customer_phone}</span>
                            </p>
                          </div>
                        </div>

                        {/* Job details */}
                        <div>
                          <h4 className="text-xs font-semibold text-white/40 uppercase mb-2">
                            Job Details
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-white/40">Waste:</span>{' '}
                              <span className="text-[#E8E4DF]">
                                {quote.waste_types
                                  .map((wt) => WASTE_TYPE_INFO[wt]?.label)
                                  .join(', ')}
                              </span>
                            </p>
                            <p>
                              <span className="text-white/40">Load:</span>{' '}
                              <span className="text-[#E8E4DF]">
                                {LOAD_SIZE_INFO[quote.load_size]?.label} ({LOAD_SIZE_INFO[quote.load_size]?.description})
                              </span>
                            </p>
                            <p>
                              <span className="text-white/40">Frequency:</span>{' '}
                              <span className="text-[#E8E4DF]">{quote.frequency.replace('_', ' ')}</span>
                            </p>
                            {quote.preferred_date && (
                              <p>
                                <span className="text-white/40">Preferred Date:</span>{' '}
                                <span className="text-[#E8E4DF]">{quote.preferred_date}</span>
                              </p>
                            )}
                            {quote.time_slot && (
                              <p>
                                <span className="text-white/40">Time:</span>{' '}
                                <span className="text-[#E8E4DF]">{quote.time_slot}</span>
                              </p>
                            )}
                            {quote.distance_miles && (
                              <p>
                                <span className="text-white/40">Distance:</span>{' '}
                                <span className="text-[#E8E4DF]">{quote.distance_miles} miles</span>
                              </p>
                            )}
                            {quote.is_emergency && (
                              <p className="text-[#EF4444] font-semibold">
                                Emergency / ASAP Request
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Pricing */}
                        <div>
                          <h4 className="text-xs font-semibold text-white/40 uppercase mb-2">
                            Pricing
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-white/40">Estimate:</span>{' '}
                              <span className="font-semibold text-[#E8E4DF]">
                                {formatCurrency(quote.estimated_price_min)} - {formatCurrency(quote.estimated_price_max)}
                              </span>
                            </p>
                            {quote.admin_adjusted_price && (
                              <p>
                                <span className="text-white/40">Admin Price:</span>{' '}
                                <span className="font-bold text-[#FF6B00]">
                                  {formatCurrency(quote.admin_adjusted_price)}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/[0.06]">
                        <Button
                          size="sm"
                          variant="primary"
                          icon={<Check className="h-4 w-4" />}
                          onClick={() => handleAction('approve', quote.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<DollarSign className="h-4 w-4" />}
                          onClick={() => handleAction('adjust_price', quote.id)}
                        >
                          Adjust Price
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<Send className="h-4 w-4" />}
                          onClick={() => handleAction('mark_sent', quote.id)}
                        >
                          Mark as Sent
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
