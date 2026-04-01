'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/store/admin';
import type { CustomerTag } from '@/types';
import { formatCurrency, formatPhone } from '@/lib/constants';
import {
  Search, Plus, Building2, Home, ChevronRight, Download,
} from 'lucide-react';

const TAG_STYLES: Record<CustomerTag, string> = {
  one_time: 'bg-white/[0.06] text-white/50',
  recurring: 'bg-[#3B82F6]/15 text-[#3B82F6]',
  contractor: 'bg-[#A855F7]/15 text-[#A855F7]',
  homeowner: 'bg-[#22C55E]/15 text-[#22C55E]',
  vip: 'bg-[#FFB800]/15 text-[#FFB800]',
  slow_payer: 'bg-[#EF4444]/15 text-[#EF4444]',
};

type SortKey = 'name' | 'total_jobs' | 'total_revenue';

export default function CustomersPage() {
  const { customers } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('total_revenue');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (typeFilter !== 'all') {
      result = result.filter((c) => c.customer_type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.company_name && c.company_name.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

    return result;
  }, [customers, searchQuery, typeFilter, sortBy, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(false); }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Company', 'Phone', 'Email', 'Type', 'Tags', 'Jobs', 'Revenue'];
    const rows = filteredCustomers.map((c) => [
      c.name, c.company_name || '', c.phone, c.email, c.customer_type,
      c.tags.join(';'), String(c.total_jobs), String(c.total_revenue),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ label, sortKey, className = '' }: { label: string; sortKey: SortKey; className?: string }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className={`text-xs font-semibold text-white/40 uppercase tracking-wide hover:text-white/60 transition-colors flex items-center gap-1 ${className}`}
      aria-label={`Sort by ${label}`}
    >
      {label}
      {sortBy === sortKey && <span className="text-[#FF6B00]">{sortAsc ? '↑' : '↓'}</span>}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-white/50 text-sm mt-0.5">{customers.length} total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/60 text-xs font-medium min-h-[40px] transition-colors"
            aria-label="Export customers as CSV"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export
          </button>
          <Link
            href="/admin/customers/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#E55F00] text-white text-xs font-semibold min-h-[40px] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            New Customer
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search name, company, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm placeholder:text-white/30"
            aria-label="Search customers"
          />
        </div>
        <div className="flex rounded-xl border border-white/[0.08] overflow-hidden" role="group" aria-label="Customer type filter">
          {[
            { label: 'All', value: 'all' },
            { label: 'Residential', value: 'residential' },
            { label: 'Commercial', value: 'commercial' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              aria-pressed={typeFilter === opt.value}
              className={`px-4 py-2 text-sm font-medium transition-colors min-h-[40px] ${
                typeFilter === opt.value
                  ? 'bg-[#FF6B00] text-white'
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/[0.06]">
          <div className="col-span-3"><SortHeader label="Name" sortKey="name" /></div>
          <div className="col-span-2 text-xs font-semibold text-white/40 uppercase tracking-wide">Phone</div>
          <div className="col-span-2 text-xs font-semibold text-white/40 uppercase tracking-wide">Email</div>
          <div className="col-span-1 text-xs font-semibold text-white/40 uppercase tracking-wide">Type</div>
          <div className="col-span-2 text-xs font-semibold text-white/40 uppercase tracking-wide">Tags</div>
          <div className="col-span-1 text-right"><SortHeader label="Jobs" sortKey="total_jobs" className="justify-end" /></div>
          <div className="col-span-1 text-right"><SortHeader label="Revenue" sortKey="total_revenue" className="justify-end" /></div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 text-lg mb-3">No customers found</p>
            <Link href="/admin/customers/new" className="text-[#FF6B00] hover:underline text-sm">Add your first customer</Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filteredCustomers.map((customer) => (
              <Link
                key={customer.id}
                href={`/admin/customers/${customer.id}`}
                className="block px-6 py-4 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-2">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00] text-xs font-bold shrink-0">
                      {customer.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-[#FF6B00] transition-colors">
                        {customer.name}
                      </p>
                      {customer.company_name && (
                        <p className="text-xs text-white/30 truncate">{customer.company_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-white/50 truncate">{formatPhone(customer.phone)}</div>
                  <div className="col-span-2 text-sm text-white/50 truncate">{customer.email}</div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      customer.customer_type === 'commercial' ? 'text-[#A855F7]' : 'text-[#22C55E]'
                    }`}>
                      {customer.customer_type === 'commercial' ? (
                        <Building2 className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <Home className="h-3 w-3" aria-hidden="true" />
                      )}
                      <span className="hidden xl:inline capitalize">{customer.customer_type}</span>
                    </span>
                  </div>
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {customer.tags.map((tag) => (
                      <span key={tag} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${TAG_STYLES[tag]}`}>
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                  <div className="col-span-1 text-sm text-white/50 text-right">{customer.total_jobs}</div>
                  <div className="col-span-1 text-sm font-semibold text-right flex items-center justify-end gap-1">
                    {formatCurrency(customer.total_revenue)}
                    <ChevronRight className="h-3.5 w-3.5 text-white/20 group-hover:text-[#FF6B00] transition-colors" aria-hidden="true" />
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
