'use client';

import { useState, useCallback, useRef } from 'react';
import {
  MapPin,
  Phone,
  Navigation,
  Camera,
  Clock,
  RefreshCw,
  Truck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sun,
  Sunset,
} from 'lucide-react';
import type { BookingStatus, WasteType, LoadSize, TimeSlot } from '@/types';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, TIME_SLOT_INFO } from '@/types';

// --- Mock Data (inline, no external imports) ---

interface DriverJob {
  id: string;
  timeSlot: TimeSlot;
  address: string;
  customerName: string;
  customerPhone: string;
  wasteTypes: WasteType[];
  loadSize: LoadSize;
  specialInstructions?: string;
  status: BookingStatus;
  estimatedPrice: number;
}

const initialJobs: DriverJob[] = [
  {
    id: 'job-001',
    timeSlot: 'morning',
    address: '1425 NW 7th St, Miami, FL 33125',
    customerName: 'Carlos Mendez',
    customerPhone: '+13055551234',
    wasteTypes: ['concrete_brick', 'metal_rebar'],
    loadSize: 'heavy',
    specialInstructions:
      'Enter through side gate. Ask for Carlos on site. Forklift available.',
    status: 'confirmed',
    estimatedPrice: 650,
  },
  {
    id: 'job-002',
    timeSlot: 'morning',
    address: '8750 SW 72nd St, Miami, FL 33173',
    customerName: 'Jennifer Lawson',
    customerPhone: '+13055559876',
    wasteTypes: ['drywall_plaster', 'wood_lumber', 'tile_ceramic'],
    loadSize: 'medium',
    specialInstructions:
      'Kitchen and bathroom remodel. Debris in driveway. Ring doorbell on arrival.',
    status: 'confirmed',
    estimatedPrice: 380,
  },
  {
    id: 'job-003',
    timeSlot: 'afternoon',
    address: '350 S Miami Ave, Miami, FL 33130',
    customerName: 'Premier Build Group',
    customerPhone: '+13055554567',
    wasteTypes: ['mixed_debris', 'roofing_shingles'],
    loadSize: 'full_truck',
    specialInstructions:
      'Commercial site. Check in at trailer. Hard hat required.',
    status: 'scheduled',
    estimatedPrice: 950,
  },
  {
    id: 'job-004',
    timeSlot: 'afternoon',
    address: '2200 NE 163rd St, North Miami Beach, FL 33160',
    customerName: 'Roberto Santos',
    customerPhone: '+13055558899',
    wasteTypes: ['roofing_shingles', 'wood_lumber'],
    loadSize: 'medium',
    status: 'scheduled',
    estimatedPrice: 420,
  },
];

// --- Status flow ---

const statusFlow: BookingStatus[] = [
  'confirmed',
  'en_route',
  'arrived',
  'loading',
  'completed',
];

function getNextStatus(current: BookingStatus): BookingStatus | null {
  const idx = statusFlow.indexOf(current);
  if (idx === -1 || idx >= statusFlow.length - 1) return null;
  return statusFlow[idx + 1];
}

const nextStatusButton: Record<
  string,
  { label: string; bg: string; activeBg: string }
> = {
  en_route: {
    label: 'Mark En Route',
    bg: 'bg-[#FF6B00]',
    activeBg: 'active:bg-[#e55f00]',
  },
  arrived: {
    label: 'Mark Arrived',
    bg: 'bg-[#2563EB]',
    activeBg: 'active:bg-[#1d4ed8]',
  },
  loading: {
    label: 'Mark Loading',
    bg: 'bg-[#FFB800]',
    activeBg: 'active:bg-[#e5a600]',
  },
  completed: {
    label: 'Mark Completed',
    bg: 'bg-[#22C55E]',
    activeBg: 'active:bg-[#16a34a]',
  },
};

function formatPhoneDisplay(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) {
    return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  }
  return phone;
}

// --- Main Component ---

export default function DriverDashboard() {
  const [jobs, setJobs] = useState<DriverJob[]>(initialJobs);
  const [refreshing, setRefreshing] = useState(false);

  const handleStatusUpdate = useCallback((jobId: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const next = getNextStatus(job.status);
        if (!next) return job;
        return { ...job, status: next };
      })
    );
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const remainingCount = jobs.length - completedCount;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Determine the first non-completed, non-scheduled job as the "active" one
  const activeJobId = jobs.find(
    (j) => !['completed', 'scheduled'].includes(j.status)
  )?.id;

  return (
    <div className="px-4 py-5 space-y-5 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">
            Today&apos;s Jobs
          </h1>
          <p className="text-xs text-[#1A1A1A]/50 font-medium mt-0.5">
            {todayStr}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-xl bg-white border border-[#E8E4DF] px-3.5 py-2.5 text-xs font-semibold text-[#1A1A1A]/70 shadow-sm active:bg-[#E8E4DF] cursor-pointer transition-colors"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-2xl border border-[#E8E4DF] p-3.5 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-[#1A1A1A]">
            {jobs.length}
          </p>
          <p className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest font-bold mt-0.5">
            Total
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E4DF] p-3.5 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-[#22C55E]">
            {completedCount}
          </p>
          <p className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest font-bold mt-0.5">
            Done
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E4DF] p-3.5 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-[#FF6B00]">
            {remainingCount}
          </p>
          <p className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest font-bold mt-0.5">
            Left
          </p>
        </div>
      </div>

      {/* Job cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isActive={job.id === activeJobId}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
}

// --- Job Card ---

function JobCard({
  job,
  isActive,
  onStatusUpdate,
}: {
  job: DriverJob;
  isActive: boolean;
  onStatusUpdate: (id: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCompleted = job.status === 'completed';
  const next = getNextStatus(job.status);
  const buttonConfig = next ? nextStatusButton[next] : null;

  const slotInfo = TIME_SLOT_INFO[job.timeSlot];
  const loadInfo = LOAD_SIZE_INFO[job.loadSize];
  const SlotIcon = job.timeSlot === 'morning' ? Sun : Sunset;

  const openGoogleMaps = () => {
    const encoded = encodeURIComponent(job.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
      '_blank'
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transition-all ${
        isActive
          ? 'border-l-4 border-l-[#FF6B00] border-t border-r border-b border-t-[#E8E4DF] border-r-[#E8E4DF] border-b-[#E8E4DF] shadow-md shadow-[#FF6B00]/10'
          : 'border border-[#E8E4DF] shadow-sm'
      } ${isCompleted ? 'opacity-60' : ''}`}
    >
      {/* Card body */}
      <div className="p-5 space-y-4">
        {/* Time slot badge + completed badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E4DF]/60 px-3 py-1 text-xs font-semibold text-[#1A1A1A]/70">
            <SlotIcon className="h-3.5 w-3.5" />
            {slotInfo.label} &middot; {slotInfo.description}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/10 px-2.5 py-1 text-xs font-bold text-[#22C55E]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Done
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2.5">
          <MapPin className="h-5 w-5 text-[#FF6B00] mt-0.5 shrink-0" />
          <p className="text-base font-bold text-[#1A1A1A] leading-snug">
            {job.address}
          </p>
        </div>

        {/* Customer + phone */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#1A1A1A]/80">
            {job.customerName}
          </p>
          <a
            href={`tel:${job.customerPhone}`}
            className="flex items-center gap-1.5 rounded-xl bg-[#22C55E]/10 px-3 py-2 text-xs font-bold text-[#22C55E] active:bg-[#22C55E]/20 min-h-[44px]"
          >
            <Phone className="h-4 w-4" />
            {formatPhoneDisplay(job.customerPhone)}
          </a>
        </div>

        {/* Waste types */}
        <div className="flex flex-wrap gap-1.5">
          {job.wasteTypes.map((wt) => (
            <span
              key={wt}
              className="inline-flex items-center gap-1 rounded-lg bg-[#E8E4DF]/50 px-2.5 py-1.5 text-xs font-medium text-[#1A1A1A]/70"
            >
              <span>{WASTE_TYPE_INFO[wt].icon}</span>
              {WASTE_TYPE_INFO[wt].label}
            </span>
          ))}
        </div>

        {/* Load size */}
        <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/50 font-medium">
          <Truck className="h-4 w-4" />
          <span>
            {loadInfo.label} &middot; {loadInfo.description}
          </span>
          <span className="ml-auto font-bold text-[#1A1A1A] text-sm">
            ${job.estimatedPrice}
          </span>
        </div>

        {/* Special instructions */}
        {job.specialInstructions && (
          <div className="flex items-start gap-2.5 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/25 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-[#FFB800] mt-0.5 shrink-0" />
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              {job.specialInstructions}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isCompleted && (
        <div className="px-5 pb-5 space-y-2.5">
          {/* Status progression button */}
          {buttonConfig && (
            <button
              onClick={() => onStatusUpdate(job.id)}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl ${buttonConfig.bg} ${buttonConfig.activeBg} py-4 min-h-[52px] text-sm font-bold text-white cursor-pointer transition-colors`}
            >
              {buttonConfig.label}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Navigate + Upload row */}
          <div className="flex gap-2.5">
            <button
              onClick={openGoogleMaps}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#1A1A1A] py-3.5 min-h-[52px] text-sm font-bold text-[#1A1A1A] active:bg-[#1A1A1A] active:text-white cursor-pointer transition-colors"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#E8E4DF] py-3.5 min-h-[52px] text-sm font-bold text-[#1A1A1A]/60 active:bg-[#E8E4DF] cursor-pointer transition-colors"
            >
              <Camera className="h-4 w-4" />
              Upload Photos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Completed state: photo upload only */}
      {isCompleted && (
        <div className="px-5 pb-5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E8E4DF] py-3.5 min-h-[52px] text-sm font-medium text-[#1A1A1A]/40 active:bg-[#E8E4DF]/50 cursor-pointer transition-colors"
          >
            <Camera className="h-4 w-4" />
            Add Completion Photos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
