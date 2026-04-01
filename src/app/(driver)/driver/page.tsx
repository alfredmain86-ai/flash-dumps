'use client';

import { useState, useCallback, useRef } from 'react';
import {
  MapPin, Phone, Navigation, Camera, Clock, RefreshCw, Truck,
  AlertTriangle, CheckCircle2, ChevronRight, Sun, Sunset,
  Scale, History, User,
} from 'lucide-react';
import type { BookingStatus, Booking } from '@/types';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, TIME_SLOT_INFO } from '@/types';
import { useAdminStore } from '@/store/admin';
import { formatCurrency } from '@/lib/constants';

const statusFlow: BookingStatus[] = ['confirmed', 'en_route', 'arrived', 'loading', 'completed'];

function getNextStatus(current: BookingStatus): BookingStatus | null {
  const idx = statusFlow.indexOf(current);
  if (idx === -1 || idx >= statusFlow.length - 1) return null;
  return statusFlow[idx + 1];
}

const nextStatusButton: Record<string, { label: string; bg: string }> = {
  en_route: { label: 'Start Route', bg: 'bg-[#FF6B00]' },
  arrived: { label: 'Arrived on Site', bg: 'bg-[#2563EB]' },
  loading: { label: 'Start Loading', bg: 'bg-[#FFB800]' },
  completed: { label: 'Mark Completed', bg: 'bg-[#22C55E]' },
};

function formatPhoneDisplay(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return phone;
}

type DriverTab = 'today' | 'history' | 'account';

export default function DriverDashboard() {
  const { bookings, updateBooking } = useAdminStore();
  const [tab, setTab] = useState<DriverTab>('today');
  const [refreshing, setRefreshing] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];

  // Get today's jobs for truck-001 (driver's assigned truck)
  const todayJobs = bookings
    .filter((b) => b.scheduled_date === todayStr && b.truck_id === 'truck-001')
    .sort((a, b) => {
      const order: Record<string, number> = { morning: 0, afternoon: 1, emergency: 2 };
      return (order[a.time_slot] ?? 0) - (order[b.time_slot] ?? 0);
    });

  const pastJobs = bookings
    .filter((b) => b.truck_id === 'truck-001' && b.status === 'completed' && b.scheduled_date < todayStr)
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date))
    .slice(0, 20);

  const handleStatusUpdate = useCallback((bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    const next = getNextStatus(booking.status);
    if (!next) return;
    updateBooking(bookingId, { status: next, updated_at: new Date().toISOString() });
  }, [bookings, updateBooking]);

  const handleWeightEntry = useCallback((bookingId: string, weight: number) => {
    updateBooking(bookingId, { actual_weight: weight, updated_at: new Date().toISOString() });
  }, [updateBooking]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const completedCount = todayJobs.filter((j) => j.status === 'completed').length;
  const remainingCount = todayJobs.length - completedCount;
  const activeJobId = todayJobs.find((j) => !['completed', 'scheduled'].includes(j.status))?.id;

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const totalEarnings = pastJobs.reduce((s, b) => s + (b.final_price ?? b.estimated_price), 0);

  return (
    <div className="max-w-lg mx-auto">
      {/* Tab content */}
      {tab === 'today' && (
        <div className="px-4 py-5 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Today&apos;s Jobs</h1>
              <p className="text-xs text-[#1A1A1A]/50 font-medium mt-0.5">{todayLabel}</p>
            </div>
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl bg-white border border-[#E8E4DF] px-3.5 py-2.5 text-xs font-semibold text-[#1A1A1A]/70 shadow-sm min-h-[44px]"
              aria-label="Refresh jobs">
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl border border-[#E8E4DF] p-3.5 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-[#1A1A1A]">{todayJobs.length}</p>
              <p className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest font-bold mt-0.5">Total</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E4DF] p-3.5 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-[#22C55E]">{completedCount}</p>
              <p className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest font-bold mt-0.5">Done</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E4DF] p-3.5 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-[#FF6B00]">{remainingCount}</p>
              <p className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest font-bold mt-0.5">Left</p>
            </div>
          </div>

          {/* Job cards */}
          {todayJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E4DF]">
              <Truck className="h-8 w-8 text-[#1A1A1A]/20 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-[#1A1A1A]/40">No jobs scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isActive={job.id === activeJobId}
                  onStatusUpdate={handleStatusUpdate}
                  onWeightEntry={handleWeightEntry}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="px-4 py-5 space-y-4">
          <h1 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Job History</h1>
          {pastJobs.length === 0 ? (
            <p className="text-sm text-[#1A1A1A]/40 text-center py-8">No completed jobs yet</p>
          ) : (
            <div className="space-y-2">
              {pastJobs.map((b) => (
                <div key={b.id} className="bg-white rounded-xl border border-[#E8E4DF] p-3 shadow-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#1A1A1A]/40">{b.scheduled_date}</span>
                    <span className="text-sm font-bold text-[#22C55E]">{formatCurrency(b.final_price ?? b.estimated_price)}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{b.customer?.name ?? 'Customer'}</p>
                  <p className="text-xs text-[#1A1A1A]/50">{b.address}</p>
                  {b.actual_weight && <p className="text-xs text-[#1A1A1A]/40 mt-1">Weight: {b.actual_weight} tons</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'account' && (
        <div className="px-4 py-5 space-y-6">
          <h1 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Account</h1>
          <div className="bg-white rounded-2xl border border-[#E8E4DF] p-5 shadow-sm text-center">
            <div className="h-16 w-16 rounded-full bg-[#FF6B00] flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">JR</div>
            <p className="text-lg font-bold text-[#1A1A1A]">Juan Rodriguez</p>
            <p className="text-sm text-[#1A1A1A]/50">Driver — Flash 1</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-[#E8E4DF] p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-[#22C55E]">{formatCurrency(totalEarnings)}</p>
              <p className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest font-bold mt-1">Total Revenue</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E4DF] p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-[#1A1A1A]">{pastJobs.length}</p>
              <p className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest font-bold mt-1">Jobs Done</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8E4DF] p-4 shadow-sm">
            <p className="text-xs text-[#1A1A1A]/40 mb-2">Contact Dispatch</p>
            <a href="tel:+13051234567" className="flex items-center gap-2 text-sm font-semibold text-[#FF6B00] min-h-[44px]">
              <Phone className="h-4 w-4" aria-hidden="true" />
              (305) 123-4567
            </a>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E4DF] z-50" aria-label="Driver navigation">
        <div className="flex items-stretch justify-around max-w-lg mx-auto">
          {([
            { key: 'today' as DriverTab, label: 'Today', icon: Clock },
            { key: 'history' as DriverTab, label: 'History', icon: History },
            { key: 'account' as DriverTab, label: 'Account', icon: User },
          ]).map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 py-3 px-4 min-h-[56px] min-w-[64px] ${
                  active ? 'text-[#FF6B00]' : 'text-[#1A1A1A]/40'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[10px] font-semibold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function JobCard({ job, isActive, onStatusUpdate, onWeightEntry }: {
  job: Booking;
  isActive: boolean;
  onStatusUpdate: (id: string) => void;
  onWeightEntry: (id: string, weight: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [weightInput, setWeightInput] = useState('');
  const [showWeight, setShowWeight] = useState(false);
  const isCompleted = job.status === 'completed';
  const next = getNextStatus(job.status);
  const buttonConfig = next ? nextStatusButton[next] : null;

  const slotInfo = TIME_SLOT_INFO[job.time_slot];
  const loadInfo = LOAD_SIZE_INFO[job.load_size];
  const SlotIcon = job.time_slot === 'morning' ? Sun : Sunset;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all ${
      isActive ? 'border-l-4 border-l-[#FF6B00] border-t border-r border-b border-[#E8E4DF] shadow-md shadow-[#FF6B00]/10'
      : 'border border-[#E8E4DF] shadow-sm'
    } ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="p-5 space-y-3">
        {/* Time slot + status */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E4DF]/60 px-3 py-1 text-xs font-semibold text-[#1A1A1A]/70">
            <SlotIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {slotInfo.label} &middot; {slotInfo.description}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/10 px-2.5 py-1 text-xs font-bold text-[#22C55E]">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Done
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2.5">
          <MapPin className="h-5 w-5 text-[#FF6B00] mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-base font-bold text-[#1A1A1A] leading-snug">{job.address}</p>
        </div>

        {/* Customer + phone */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#1A1A1A]/80">{job.customer?.name ?? 'Customer'}</p>
          {job.customer?.phone && (
            <a href={`tel:${job.customer.phone}`}
              className="flex items-center gap-1.5 rounded-xl bg-[#22C55E]/10 px-3 py-2 text-xs font-bold text-[#22C55E] min-h-[44px]"
              aria-label={`Call ${job.customer.name}`}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              {formatPhoneDisplay(job.customer.phone)}
            </a>
          )}
        </div>

        {/* Waste types */}
        <div className="flex flex-wrap gap-1.5">
          {job.waste_types.map((wt) => (
            <span key={wt} className="inline-flex items-center gap-1 rounded-lg bg-[#E8E4DF]/50 px-2.5 py-1.5 text-xs font-medium text-[#1A1A1A]/70">
              <span aria-hidden="true">{WASTE_TYPE_INFO[wt].icon}</span> {WASTE_TYPE_INFO[wt].label}
            </span>
          ))}
        </div>

        {/* Load + price */}
        <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/50 font-medium">
          <Truck className="h-4 w-4" aria-hidden="true" />
          <span>{loadInfo.label} &middot; {loadInfo.description}</span>
          <span className="ml-auto font-bold text-[#1A1A1A] text-sm">{formatCurrency(job.estimated_price)}</span>
        </div>

        {/* Special instructions */}
        {job.special_instructions && (
          <div className="flex items-start gap-2.5 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/25 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-[#FFB800] mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">{job.special_instructions}</p>
          </div>
        )}

        {/* Weight display */}
        {job.actual_weight && (
          <div className="flex items-center gap-2 text-xs bg-[#22C55E]/10 rounded-lg px-3 py-2">
            <Scale className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
            <span className="text-[#22C55E] font-semibold">Recorded weight: {job.actual_weight} tons</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isCompleted && (
        <div className="px-5 pb-5 space-y-2.5">
          {/* Weight entry (shown when loading) */}
          {job.status === 'loading' && (
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1A1A1A]/30" aria-hidden="true" />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Weight (tons)"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E4DF] text-sm bg-white"
                  aria-label="Dump weight in tons"
                />
              </div>
              <button
                onClick={() => { if (weightInput) { onWeightEntry(job.id, Number(weightInput)); setWeightInput(''); } }}
                disabled={!weightInput}
                className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold min-h-[44px] disabled:opacity-40"
              >
                Save
              </button>
            </div>
          )}

          {buttonConfig && (
            <button onClick={() => onStatusUpdate(job.id)}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl ${buttonConfig.bg} py-4 min-h-[52px] text-sm font-bold text-white`}
              aria-label={buttonConfig.label}>
              {buttonConfig.label}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          <div className="flex gap-2.5">
            <button
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.address)}`, '_blank')}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#1A1A1A] py-3.5 min-h-[52px] text-sm font-bold text-[#1A1A1A]"
              aria-label="Navigate to job site">
              <Navigation className="h-4 w-4" aria-hidden="true" /> Navigate
            </button>
            <button onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#E8E4DF] py-3.5 min-h-[52px] text-sm font-bold text-[#1A1A1A]/60"
              aria-label="Upload photos">
              <Camera className="h-4 w-4" aria-hidden="true" /> Photos
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" aria-hidden="true" />
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="px-5 pb-5">
          <button onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E8E4DF] py-3.5 min-h-[52px] text-sm font-medium text-[#1A1A1A]/40"
            aria-label="Add completion photos">
            <Camera className="h-4 w-4" aria-hidden="true" /> Add Completion Photos
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
