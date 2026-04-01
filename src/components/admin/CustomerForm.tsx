'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import type { Customer, CustomerTag, CreditTerms, CustomerType } from '@/types';
import { useAdminStore } from '@/store/admin';

const CUSTOMER_TYPES: { value: CustomerType; label: string }[] = [
  { value: 'commercial', label: 'Contractor / Commercial' },
  { value: 'residential', label: 'Homeowner / Residential' },
];

const AVAILABLE_TAGS: { value: CustomerTag; label: string }[] = [
  { value: 'contractor', label: 'Contractor' },
  { value: 'homeowner', label: 'Homeowner' },
  { value: 'recurring', label: 'Recurring' },
  { value: 'one_time', label: 'One-Time' },
  { value: 'vip', label: 'VIP' },
  { value: 'slow_payer', label: 'Slow Payer' },
];

const CREDIT_TERMS: { value: CreditTerms; label: string }[] = [
  { value: 'cod', label: 'COD (Cash on Delivery)' },
  { value: 'net_15', label: 'Net 15' },
  { value: 'net_30', label: 'Net 30' },
];

interface CustomerFormProps {
  customer?: Customer; // If editing
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const { addCustomer, updateCustomer } = useAdminStore();
  const isEditing = !!customer;

  const [form, setForm] = useState({
    name: customer?.name ?? '',
    company_name: customer?.company_name ?? '',
    phone: customer?.phone ?? '',
    email: customer?.email ?? '',
    address: customer?.address ?? '',
    customer_type: customer?.customer_type ?? ('residential' as CustomerType),
    tags: customer?.tags ?? ([] as CustomerTag[]),
    credit_terms: customer?.credit_terms ?? ('cod' as CreditTerms),
    preferred_language: customer?.preferred_language ?? ('en' as 'en' | 'es'),
    notes: customer?.notes ?? '',
    job_site_addresses: customer?.job_site_addresses ?? ([] as string[]),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSiteAddress, setNewSiteAddress] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email format';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && customer) {
      updateCustomer(customer.id, {
        ...form,
        tags: form.tags,
        job_site_addresses: form.job_site_addresses,
      });
      router.push(`/admin/customers/${customer.id}`);
    } else {
      const newId = `cust-${Date.now()}`;
      addCustomer({
        id: newId,
        ...form,
        internal_notes: [],
        internal_rating: undefined,
        preferred_payment: undefined,
        created_at: new Date().toISOString(),
        total_jobs: 0,
        total_revenue: 0,
      });
      router.push(`/admin/customers/${newId}`);
    }
  };

  const toggleTag = (tag: CustomerTag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const addSiteAddress = () => {
    if (!newSiteAddress.trim()) return;
    setForm((f) => ({
      ...f,
      job_site_addresses: [...f.job_site_addresses, newSiteAddress.trim()],
    }));
    setNewSiteAddress('');
  };

  const removeSiteAddress = (index: number) => {
    setForm((f) => ({
      ...f,
      job_site_addresses: f.job_site_addresses.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Customer' : 'New Customer'}</h1>
      </div>

      {/* Name & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1.5">
            Name <span className="text-[#FF6B00]">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white placeholder:text-white/30"
            placeholder="Full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-white/70 mb-1.5">Company</label>
          <input
            id="company"
            type="text"
            value={form.company_name}
            onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white placeholder:text-white/30"
            placeholder="Company name (optional)"
          />
        </div>
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-1.5">
            Phone <span className="text-[#FF6B00]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white placeholder:text-white/30"
            placeholder="+1 (305) 555-0000"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && <p id="phone-error" className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white placeholder:text-white/30"
            placeholder="email@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.email}</p>}
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-white/70 mb-1.5">Primary Address</label>
        <input
          id="address"
          type="text"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white placeholder:text-white/30"
          placeholder="Street address, city, state, zip"
        />
      </div>

      {/* Type & Credit Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-white/70 mb-1.5">Customer Type</label>
          <select
            id="type"
            value={form.customer_type}
            onChange={(e) => setForm((f) => ({ ...f, customer_type: e.target.value as CustomerType }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white"
          >
            {CUSTOMER_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#1A1A1A]">{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="credit" className="block text-sm font-medium text-white/70 mb-1.5">Credit Terms</label>
          <select
            id="credit"
            value={form.credit_terms}
            onChange={(e) => setForm((f) => ({ ...f, credit_terms: e.target.value as CreditTerms }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white"
          >
            {CREDIT_TERMS.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#1A1A1A]">{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Language */}
      <div>
        <span className="block text-sm font-medium text-white/70 mb-1.5">Preferred Language</span>
        <div className="flex gap-3" role="radiogroup" aria-label="Preferred language">
          {[{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }].map((lang) => (
            <label
              key={lang.value}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer min-h-[44px] transition-colors ${
                form.preferred_language === lang.value
                  ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]'
                  : 'border-white/[0.08] bg-white/[0.04] text-white/60 hover:text-white/80'
              }`}
            >
              <input
                type="radio"
                name="language"
                value={lang.value}
                checked={form.preferred_language === lang.value}
                onChange={(e) => setForm((f) => ({ ...f, preferred_language: e.target.value as 'en' | 'es' }))}
                className="sr-only"
              />
              {lang.label}
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <span className="block text-sm font-medium text-white/70 mb-1.5">Tags</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Customer tags">
          {AVAILABLE_TAGS.map((tag) => {
            const selected = form.tags.includes(tag.value);
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleTag(tag.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors min-h-[36px] ${
                  selected
                    ? 'border-[#FF6B00] bg-[#FF6B00]/15 text-[#FF6B00]'
                    : 'border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70'
                }`}
                aria-pressed={selected}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Site Addresses */}
      <div>
        <span className="block text-sm font-medium text-white/70 mb-1.5">Job Site Addresses</span>
        {form.job_site_addresses.map((addr, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <span className="flex-1 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-sm text-white/70">{addr}</span>
            <button
              type="button"
              onClick={() => removeSiteAddress(i)}
              className="p-2 text-white/30 hover:text-[#EF4444] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Remove address: ${addr}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSiteAddress}
            onChange={(e) => setNewSiteAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSiteAddress())}
            className="flex-1 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder:text-white/30"
            placeholder="Add job site address"
            aria-label="New job site address"
          />
          <button
            type="button"
            onClick={addSiteAddress}
            className="px-3 py-2.5 rounded-lg bg-white/[0.06] text-white/60 hover:text-white text-sm font-medium min-h-[44px] flex items-center gap-1"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-white/70 mb-1.5">Notes</label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white placeholder:text-white/30 min-h-[80px] resize-y"
          placeholder="General notes about this customer"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#E55F00] text-white font-semibold text-sm min-h-[48px] flex items-center gap-2 transition-colors"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isEditing ? 'Save Changes' : 'Create Customer'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/70 font-medium text-sm min-h-[48px] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
