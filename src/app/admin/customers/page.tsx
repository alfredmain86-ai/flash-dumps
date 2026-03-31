'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui';
import { MOCK_CUSTOMERS } from '@/lib/mock-data';
import type { Customer, CustomerTag } from '@/types';
import { formatCurrency, formatPhone } from '@/lib/constants';
import {
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  Home,
} from 'lucide-react';

const TAG_STYLES: Record<CustomerTag, string> = {
  one_time: 'bg-white/[0.06] text-white/50',
  recurring: 'bg-[#3B82F6]/15 text-[#3B82F6]',
  contractor: 'bg-[#A855F7]/15 text-[#A855F7]',
  homeowner: 'bg-[#22C55E]/15 text-[#22C55E]',
  vip: 'bg-[#FFB800]/15 text-[#FFB800]',
};

const TYPE_FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    let customers = [...MOCK_CUSTOMERS].sort(
      (a, b) => b.total_revenue - a.total_revenue
    );

    if (typeFilter !== 'all') {
      customers = customers.filter((c) => c.customer_type === typeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          (c.company_name && c.company_name.toLowerCase().includes(query))
      );
    }

    return customers;
  }, [searchQuery, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#E8E4DF]">Customers</h1>
        <p className="text-white/50 mt-1">
          {MOCK_CUSTOMERS.length} total customers
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, company, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#E8E4DF] text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/50"
          />
        </div>

        <div className="flex rounded-xl border border-white/[0.08] overflow-hidden">
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Customer list */}
        <div className="flex-1">
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/[0.06] text-xs font-semibold text-white/40 uppercase tracking-wide">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2">Tags</div>
              <div className="col-span-1 text-right">Jobs</div>
              <div className="col-span-1 text-right">Revenue</div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-white/30">
                <p className="text-lg">No customers found</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`w-full text-left px-6 py-4 hover:bg-white/[0.04] transition-colors cursor-pointer ${
                      selectedCustomer?.id === customer.id ? 'bg-[#FF6B00]/[0.08]' : ''
                    }`}
                  >
                    <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-2">
                      <div className="col-span-3">
                        <p className="text-sm font-medium text-[#E8E4DF] truncate">
                          {customer.name}
                        </p>
                        {customer.company_name && (
                          <p className="text-xs text-white/30 truncate">
                            {customer.company_name}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 text-sm text-white/50 truncate">
                        {formatPhone(customer.phone)}
                      </div>
                      <div className="col-span-2 text-sm text-white/50 truncate">
                        {customer.email}
                      </div>
                      <div className="col-span-1">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            customer.customer_type === 'commercial'
                              ? 'text-[#A855F7]'
                              : 'text-[#22C55E]'
                          }`}
                        >
                          {customer.customer_type === 'commercial' ? (
                            <Building2 className="h-3 w-3" />
                          ) : (
                            <Home className="h-3 w-3" />
                          )}
                          <span className="hidden xl:inline capitalize">
                            {customer.customer_type}
                          </span>
                        </span>
                      </div>
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {customer.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${TAG_STYLES[tag]}`}
                          >
                            {tag.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                      <div className="col-span-1 text-sm text-white/50 text-right">
                        {customer.total_jobs}
                      </div>
                      <div className="col-span-1 text-sm font-semibold text-[#E8E4DF] text-right">
                        {formatCurrency(customer.total_revenue)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer detail panel */}
        {selectedCustomer && (
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] font-bold text-lg">
                    {selectedCustomer.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#E8E4DF]">
                      {selectedCustomer.name}
                    </h3>
                    {selectedCustomer.company_name && (
                      <p className="text-sm text-white/40">
                        {selectedCustomer.company_name}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 rounded hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4 text-white/30" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type and tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      selectedCustomer.customer_type === 'commercial'
                        ? 'bg-[#A855F7]/15 text-[#A855F7]'
                        : 'bg-[#22C55E]/15 text-[#22C55E]'
                    }`}
                  >
                    {selectedCustomer.customer_type === 'commercial' ? (
                      <Building2 className="h-3 w-3" />
                    ) : (
                      <Home className="h-3 w-3" />
                    )}
                    {selectedCustomer.customer_type}
                  </span>
                  {selectedCustomer.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs font-medium px-2 py-1 rounded-full ${TAG_STYLES[tag]}`}
                    >
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Contact details */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-[#E8E4DF]">
                    <Phone className="h-4 w-4 text-white/30 flex-shrink-0" />
                    <span>{formatPhone(selectedCustomer.phone)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#E8E4DF]">
                    <Mail className="h-4 w-4 text-white/30 flex-shrink-0" />
                    <span className="truncate">{selectedCustomer.email}</span>
                  </div>
                  {selectedCustomer.address && (
                    <div className="flex items-start gap-3 text-sm text-[#E8E4DF]">
                      <MapPin className="h-4 w-4 text-white/30 flex-shrink-0 mt-0.5" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                  <div className="text-center p-3 rounded-xl bg-white/[0.04]">
                    <p className="text-2xl font-bold text-[#E8E4DF]">
                      {selectedCustomer.total_jobs}
                    </p>
                    <p className="text-xs text-white/40 mt-1">Total Jobs</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/[0.04]">
                    <p className="text-2xl font-bold text-[#FF6B00]">
                      {formatCurrency(selectedCustomer.total_revenue)}
                    </p>
                    <p className="text-xs text-white/40 mt-1">Total Revenue</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="pt-4 border-t border-white/[0.06] text-xs text-white/30 space-y-1">
                  <p>Language: {selectedCustomer.preferred_language === 'es' ? 'Spanish' : 'English'}</p>
                  <p>
                    Customer since:{' '}
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
