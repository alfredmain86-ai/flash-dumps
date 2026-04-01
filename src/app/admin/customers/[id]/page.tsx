'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Phone, Mail, MapPin, Pencil, Trash2,
  Building2, Star, ClipboardList, FileText, Receipt, MessageSquare,
} from 'lucide-react';
import { useAdminStore } from '@/store/admin';
import { formatCurrency, formatPhone } from '@/lib/constants';
import { Badge } from '@/components/ui';
import StarRating from '@/components/admin/StarRating';
import NotesSection from '@/components/admin/NotesSection';
import type { CustomerTag, BookingStatus, QuoteStatus } from '@/types';

const TAG_STYLES: Record<CustomerTag, string> = {
  one_time: 'bg-white/[0.06] text-white/50',
  recurring: 'bg-[#3B82F6]/15 text-[#3B82F6]',
  contractor: 'bg-[#A855F7]/15 text-[#A855F7]',
  homeowner: 'bg-[#22C55E]/15 text-[#22C55E]',
  vip: 'bg-[#FFB800]/15 text-[#FFB800]',
  slow_payer: 'bg-[#EF4444]/15 text-[#EF4444]',
};

const TABS = ['Overview', 'Jobs', 'Quotes', 'Invoices', 'Notes'] as const;

function statusBadgeVariant(s: BookingStatus | QuoteStatus) {
  const map: Record<string, string> = {
    completed: 'completed', confirmed: 'confirmed', scheduled: 'pending',
    en_route: 'in-progress', arrived: 'in-progress', loading: 'in-progress',
    cancelled: 'cancelled', new: 'warning', reviewed: 'info', sent: 'info',
    accepted: 'success', booked: 'success', expired: 'error', priced: 'info',
  };
  return (map[s] ?? 'default') as 'completed' | 'confirmed' | 'pending' | 'in-progress' | 'cancelled' | 'warning' | 'info' | 'success' | 'error' | 'default';
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { customers, bookings, quotes, updateCustomer, deleteCustomer, addCustomerNote } = useAdminStore();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const customer = customers.find((c) => c.id === id);
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white/40 text-lg mb-4">Customer not found</p>
        <Link href="/admin/customers" className="text-[#FF6B00] hover:underline text-sm">Back to Customers</Link>
      </div>
    );
  }

  const customerBookings = bookings.filter((b) => b.customer_id === customer.id);
  const customerQuotes = quotes.filter((q) => q.customer_id === customer.id);
  const avgJobValue = customer.total_jobs > 0 ? customer.total_revenue / customer.total_jobs : 0;

  const handleDelete = () => {
    deleteCustomer(customer.id);
    router.push('/admin/customers');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <button
          onClick={() => router.push('/admin/customers')}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center self-start"
          aria-label="Back to customers"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold truncate">{customer.name}</h1>
            {customer.company_name && (
              <span className="text-sm text-white/40 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                {customer.company_name}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {customer.tags.map((tag) => (
              <span key={tag} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${TAG_STYLES[tag]}`}>
                {tag.replace('_', ' ')}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-white/60 hover:text-[#FF6B00] transition-colors min-h-[44px]">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {formatPhone(customer.phone)}
            </a>
            {customer.email && (
              <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-white/60 hover:text-[#FF6B00] transition-colors min-h-[44px]">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {customer.email}
              </a>
            )}
            {customer.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(customer.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/60 hover:text-[#FF6B00] transition-colors min-h-[44px]"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {customer.address}
              </a>
            )}
          </div>
        </div>

        <div className="flex gap-2 self-start">
          <Link
            href={`/admin/customers/${customer.id}/edit`}
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/70 text-sm font-medium min-h-[44px] flex items-center gap-2 transition-colors"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-sm font-medium min-h-[44px] flex items-center gap-2 transition-colors"
            aria-label="Delete customer"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mb-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 flex items-center justify-between" role="alert">
          <p className="text-sm text-[#EF4444]">Delete {customer.name}? This cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={handleDelete} className="px-3 py-1.5 rounded bg-[#EF4444] text-white text-xs font-semibold min-h-[36px]">Delete</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1.5 rounded bg-white/[0.06] text-white/60 text-xs font-medium min-h-[36px]">Cancel</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/[0.08] mb-6" role="tablist" aria-label="Customer details">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const icons = { Overview: ClipboardList, Jobs: FileText, Quotes: FileText, Invoices: Receipt, Notes: MessageSquare };
            const Icon = icons[tab];
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap min-h-[44px] transition-colors ${
                  activeTab === tab
                    ? 'border-[#FF6B00] text-[#FF6B00]'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Revenue', value: formatCurrency(customer.total_revenue), color: 'text-[#22C55E]' },
                  { label: 'Total Jobs', value: String(customer.total_jobs), color: 'text-white' },
                  { label: 'Avg Job Value', value: formatCurrency(avgJobValue), color: 'text-white' },
                  { label: 'Credit Terms', value: customer.credit_terms.toUpperCase().replace('_', ' '), color: 'text-white/60' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                <p className="text-sm font-medium text-white/60 mb-2">Internal Rating</p>
                <StarRating
                  value={customer.internal_rating ?? 0}
                  onChange={(v) => updateCustomer(customer.id, { internal_rating: v })}
                />
              </div>

              {/* Job sites */}
              {customer.job_site_addresses.length > 0 && (
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                  <p className="text-sm font-medium text-white/60 mb-2">Job Site Addresses</p>
                  <div className="space-y-1.5">
                    {customer.job_site_addresses.map((addr, i) => (
                      <a
                        key={i}
                        href={`https://maps.google.com/?q=${encodeURIComponent(addr)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-white/60 hover:text-[#FF6B00] transition-colors"
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {addr}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info sidebar */}
            <div className="space-y-4">
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 space-y-3 text-sm">
                <p className="text-white/40">Type: <span className="text-white/70">{customer.customer_type}</span></p>
                <p className="text-white/40">Language: <span className="text-white/70">{customer.preferred_language === 'es' ? 'Spanish' : 'English'}</span></p>
                {customer.preferred_payment && (
                  <p className="text-white/40">Payment: <span className="text-white/70 capitalize">{customer.preferred_payment}</span></p>
                )}
                <p className="text-white/40">Since: <span className="text-white/70">{new Date(customer.created_at).toLocaleDateString()}</span></p>
                {customer.notes && <p className="text-white/50 italic text-xs mt-2">{customer.notes}</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Jobs' && (
          <div>
            {customerBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/30 mb-3">No jobs yet</p>
                <Link href={`/admin/bookings/new?customer_id=${customer.id}`} className="text-[#FF6B00] hover:underline text-sm">Create first booking</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {customerBookings.sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date)).map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/bookings/${b.id}`}
                    className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 hover:bg-white/[0.06] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{b.scheduled_date} &middot; {b.time_slot}</p>
                      <p className="text-xs text-white/40">{b.waste_types.map((w) => w.split('_')[0]).join(', ')} &middot; {b.load_size}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusBadgeVariant(b.status)}>{b.status.replace('_', ' ')}</Badge>
                      <span className="text-sm font-semibold">{formatCurrency(b.final_price ?? b.estimated_price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Quotes' && (
          <div>
            {customerQuotes.length === 0 ? (
              <p className="text-center py-12 text-white/30">No quotes for this customer</p>
            ) : (
              <div className="space-y-2">
                {customerQuotes.sort((a, b) => b.created_at.localeCompare(a.created_at)).map((q) => (
                  <Link
                    key={q.id}
                    href={`/admin/quotes/${q.id}`}
                    className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 hover:bg-white/[0.06] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{q.reference}</p>
                      <p className="text-xs text-white/40">{new Date(q.created_at).toLocaleDateString()} &middot; {q.waste_types.map((w) => w.split('_')[0]).join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusBadgeVariant(q.status)}>{q.status}</Badge>
                      <span className="text-sm font-semibold">${q.estimated_price_min}–${q.estimated_price_max}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Invoices' && (
          <div className="text-center py-12">
            <p className="text-white/30 mb-2">Invoice management coming in Phase 2</p>
            <p className="text-xs text-white/20">Invoices will be generated from completed bookings</p>
          </div>
        )}

        {activeTab === 'Notes' && (
          <NotesSection
            notes={customer.internal_notes}
            onAdd={(note) => addCustomerNote(customer.id, note)}
          />
        )}
      </div>
    </div>
  );
}
