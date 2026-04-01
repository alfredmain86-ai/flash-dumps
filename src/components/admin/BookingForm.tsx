'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import type { WasteType, LoadSize, TimeSlot, PickupFrequency } from '@/types';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, TIME_SLOT_INFO } from '@/types';
import { useAdminStore } from '@/store/admin';
import { calculatePrice } from '@/lib/pricing';

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customers, trucks, quotes, addBooking } = useAdminStore();

  // Pre-fill from quote if quote_id in URL
  const quoteId = searchParams.get('quote_id');
  const prefillDate = searchParams.get('date') ?? '';
  const prefillTruck = searchParams.get('truck') ?? '';
  const quote = quoteId ? quotes.find((q) => q.id === quoteId) : null;

  const [form, setForm] = useState({
    customer_id: quote?.customer_id ?? '',
    address: quote?.address ?? '',
    waste_types: quote?.waste_types ?? ([] as WasteType[]),
    load_size: quote?.load_size ?? ('medium' as LoadSize),
    scheduled_date: prefillDate || quote?.preferred_date || '',
    time_slot: quote?.time_slot ?? ('morning' as TimeSlot),
    truck_id: prefillTruck || '',
    price: quote?.admin_adjusted_price ?? quote?.estimated_price_max ?? 0,
    special_instructions: '',
    frequency: quote?.frequency ?? ('one_time' as PickupFrequency),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculate price suggestion
  const suggestedPrice = useMemo(() => {
    if (form.waste_types.length === 0) return null;
    try {
      const est = calculatePrice({
        loadSize: form.load_size,
        wasteTypes: form.waste_types,
        frequency: form.frequency,
        distanceMiles: 10,
        isEmergency: false,
      });
      return est;
    } catch {
      return null;
    }
  }, [form.waste_types, form.load_size, form.frequency]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customer_id) errs.customer_id = 'Select a customer';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (form.waste_types.length === 0) errs.waste_types = 'Select at least one waste type';
    if (!form.scheduled_date) errs.scheduled_date = 'Date is required';
    if (!form.truck_id) errs.truck_id = 'Assign a truck';
    if (!form.price || form.price <= 0) errs.price = 'Enter a price';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const customer = customers.find((c) => c.id === form.customer_id);
    const truck = trucks.find((t) => t.id === form.truck_id);
    const newId = `book-${Date.now()}`;
    const now = new Date().toISOString();

    addBooking({
      id: newId,
      quote_id: quoteId ?? '',
      customer_id: form.customer_id,
      truck_id: form.truck_id,
      scheduled_date: form.scheduled_date,
      time_slot: form.time_slot,
      status: 'scheduled',
      address: form.address,
      waste_types: form.waste_types,
      load_size: form.load_size,
      estimated_price: form.price,
      special_instructions: form.special_instructions || undefined,
      completion_photos: [],
      created_at: now,
      updated_at: now,
      customer: customer,
      truck: truck,
    });

    // If converting from quote, update quote status
    if (quoteId) {
      useAdminStore.getState().updateQuote(quoteId, { status: 'booked' });
    }

    router.push(`/admin/bookings/${newId}`);
  };

  const toggleWasteType = (wt: WasteType) => {
    setForm((f) => ({
      ...f,
      waste_types: f.waste_types.includes(wt)
        ? f.waste_types.filter((w) => w !== wt)
        : [...f.waste_types, wt],
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
        <div>
          <h1 className="text-2xl font-bold">New Booking</h1>
          {quote && (
            <p className="text-sm text-[#FF6B00]">Converting from {quote.reference}</p>
          )}
        </div>
      </div>

      {/* Customer */}
      <div>
        <label htmlFor="customer" className="block text-sm font-medium text-white/70 mb-1.5">
          Customer <span className="text-[#FF6B00]">*</span>
        </label>
        <select
          id="customer"
          value={form.customer_id}
          onChange={(e) => setForm((f) => ({ ...f, customer_id: e.target.value }))}
          className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white"
          aria-invalid={!!errors.customer_id}
          aria-describedby={errors.customer_id ? 'customer-error' : undefined}
        >
          <option value="" className="bg-[#1A1A1A]">Select a customer...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#1A1A1A]">
              {c.name}{c.company_name ? ` (${c.company_name})` : ''}
            </option>
          ))}
        </select>
        {errors.customer_id && <p id="customer-error" className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.customer_id}</p>}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-white/70 mb-1.5">
          Job Site Address <span className="text-[#FF6B00]">*</span>
        </label>
        <input
          id="address"
          type="text"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white placeholder:text-white/30"
          placeholder="Full address"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? 'address-error' : undefined}
        />
        {errors.address && <p id="address-error" className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.address}</p>}
      </div>

      {/* Waste Types */}
      <div>
        <span className="block text-sm font-medium text-white/70 mb-1.5">
          Waste Types <span className="text-[#FF6B00]">*</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Waste types">
          {(Object.keys(WASTE_TYPE_INFO) as WasteType[]).map((wt) => {
            const info = WASTE_TYPE_INFO[wt];
            const selected = form.waste_types.includes(wt);
            return (
              <button
                key={wt}
                type="button"
                onClick={() => toggleWasteType(wt)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-colors min-h-[64px] ${
                  selected
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]'
                    : 'border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70'
                }`}
                aria-pressed={selected}
              >
                <span className="text-lg" aria-hidden="true">{info.icon}</span>
                <span className="text-center leading-tight">{info.label.split(' / ')[0]}</span>
              </button>
            );
          })}
        </div>
        {errors.waste_types && <p className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.waste_types}</p>}
      </div>

      {/* Load Size */}
      <div>
        <span className="block text-sm font-medium text-white/70 mb-1.5">Load Size</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Load size">
          {(Object.keys(LOAD_SIZE_INFO) as LoadSize[]).map((ls) => {
            const info = LOAD_SIZE_INFO[ls];
            const selected = form.load_size === ls;
            return (
              <label
                key={ls}
                className={`flex flex-col items-center p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors min-h-[56px] ${
                  selected
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]'
                    : 'border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70'
                }`}
              >
                <input
                  type="radio"
                  name="load_size"
                  value={ls}
                  checked={selected}
                  onChange={() => setForm((f) => ({ ...f, load_size: ls }))}
                  className="sr-only"
                />
                <span className="font-semibold">{info.label}</span>
                <span className="text-[10px] text-white/40 mt-0.5">{info.description}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Date, Time, Truck */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-white/70 mb-1.5">
            Date <span className="text-[#FF6B00]">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={form.scheduled_date}
            onChange={(e) => setForm((f) => ({ ...f, scheduled_date: e.target.value }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white"
            aria-invalid={!!errors.scheduled_date}
          />
          {errors.scheduled_date && <p className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.scheduled_date}</p>}
        </div>
        <div>
          <label htmlFor="time_slot" className="block text-sm font-medium text-white/70 mb-1.5">Time Slot</label>
          <select
            id="time_slot"
            value={form.time_slot}
            onChange={(e) => setForm((f) => ({ ...f, time_slot: e.target.value as TimeSlot }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white"
          >
            {(Object.keys(TIME_SLOT_INFO) as TimeSlot[]).map((ts) => (
              <option key={ts} value={ts} className="bg-[#1A1A1A]">{TIME_SLOT_INFO[ts].label} — {TIME_SLOT_INFO[ts].description}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="truck" className="block text-sm font-medium text-white/70 mb-1.5">
            Truck <span className="text-[#FF6B00]">*</span>
          </label>
          <select
            id="truck"
            value={form.truck_id}
            onChange={(e) => setForm((f) => ({ ...f, truck_id: e.target.value }))}
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white"
            aria-invalid={!!errors.truck_id}
          >
            <option value="" className="bg-[#1A1A1A]">Select truck...</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#1A1A1A]">{t.name} ({t.plate_number})</option>
            ))}
          </select>
          {errors.truck_id && <p className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.truck_id}</p>}
        </div>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-white/70 mb-1.5">
          Price <span className="text-[#FF6B00]">*</span>
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
            <input
              id="price"
              type="number"
              min="0"
              step="5"
              value={form.price || ''}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] pl-7 pr-3 py-3 text-sm text-white"
              aria-invalid={!!errors.price}
            />
          </div>
          {suggestedPrice && (
            <span className="text-xs text-white/40 whitespace-nowrap">
              Suggested: ${suggestedPrice.finalMin}–${suggestedPrice.finalMax}
            </span>
          )}
        </div>
        {errors.price && <p className="mt-1 text-xs text-[#EF4444]" role="alert">{errors.price}</p>}
      </div>

      {/* Special Instructions */}
      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-white/70 mb-1.5">Special Instructions</label>
        <textarea
          id="instructions"
          value={form.special_instructions}
          onChange={(e) => setForm((f) => ({ ...f, special_instructions: e.target.value }))}
          className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-3 text-sm text-white placeholder:text-white/30 min-h-[80px] resize-y"
          placeholder="Gate codes, contact on site, special access, etc."
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-[#FF6B00] hover:bg-[#E55F00] text-white font-semibold text-sm min-h-[48px] flex items-center gap-2 transition-colors"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Create Booking
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
