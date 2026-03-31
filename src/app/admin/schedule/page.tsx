'use client';

import { useState, useMemo } from 'react';
import { Badge, Modal, Button } from '@/components/ui';
import { MOCK_BOOKINGS, MOCK_TRUCKS } from '@/lib/mock-data';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, TIME_SLOT_INFO } from '@/types';
import type { Booking } from '@/types';
import { formatCurrency } from '@/lib/constants';
import { ChevronLeft, ChevronRight, MapPin, Clock, Truck } from 'lucide-react';

type ViewMode = 'day' | 'week' | 'month';

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-[#FFB800]/20 border-[#FFB800]/40 text-[#FFB800]',
  confirmed: 'bg-[#3B82F6]/20 border-[#3B82F6]/40 text-[#3B82F6]',
  en_route: 'bg-[#FF6B00]/20 border-[#FF6B00]/40 text-[#FF6B00]',
  arrived: 'bg-[#FF6B00]/20 border-[#FF6B00]/40 text-[#FF6B00]',
  loading: 'bg-[#FF6B00]/20 border-[#FF6B00]/40 text-[#FF6B00]',
  completed: 'bg-[#22C55E]/20 border-[#22C55E]/40 text-[#22C55E]',
  cancelled: 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]',
};

function statusToBadgeVariant(status: string) {
  const map: Record<string, 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'default'> = {
    scheduled: 'pending',
    confirmed: 'confirmed',
    en_route: 'in-progress',
    arrived: 'in-progress',
    loading: 'in-progress',
    completed: 'completed',
    cancelled: 'cancelled',
  };
  return map[status] ?? 'default';
}

function getWeekDays(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day + 6) % 7));
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDateKey(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatDayHeader(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getMonthDays(baseDate: Date): Date[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const start = new Date(firstDay);
  start.setDate(start.getDate() - startDay);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const trucks = MOCK_TRUCKS;

  const navigate = (direction: number) => {
    const d = new Date(currentDate);
    if (viewMode === 'day') d.setDate(d.getDate() + direction);
    else if (viewMode === 'week') d.setDate(d.getDate() + direction * 7);
    else d.setMonth(d.getMonth() + direction);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const bookingsByDateAndTruck = useMemo(() => {
    const map: Record<string, Record<string, Booking[]>> = {};
    for (const booking of MOCK_BOOKINGS) {
      const dateKey = booking.scheduled_date;
      if (!map[dateKey]) map[dateKey] = {};
      const truckId = booking.truck_id ?? 'unassigned';
      if (!map[dateKey][truckId]) map[dateKey][truckId] = [];
      map[dateKey][truckId].push(booking);
    }
    return map;
  }, []);

  const headerLabel = useMemo(() => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [viewMode, currentDate, weekDays]);

  const todayKey = formatDateKey(new Date());

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E4DF]">Schedule</h1>
          <p className="text-white/50 mt-1">Manage bookings and truck assignments</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex rounded-xl border border-white/[0.08] overflow-hidden">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  viewMode === mode
                    ? 'bg-[#FF6B00] text-white'
                    : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-white/50" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 text-white/50" />
          </button>
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-sm font-medium rounded-xl border border-white/[0.08] hover:bg-white/[0.06] transition-colors cursor-pointer text-white/70"
          >
            Today
          </button>
        </div>
        <h2 className="text-lg font-semibold text-[#E8E4DF]">{headerLabel}</h2>
      </div>

      {/* Calendar content */}
      {viewMode === 'week' && (
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-white/[0.06]">
                {weekDays.map((day) => {
                  const key = formatDateKey(day);
                  const isToday = key === todayKey;
                  return (
                    <div
                      key={key}
                      className={`px-2 py-3 text-center text-sm font-medium border-r border-white/[0.04] last:border-r-0 ${
                        isToday ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-white/50'
                      }`}
                    >
                      {formatDayHeader(day)}
                    </div>
                  );
                })}
              </div>

              {/* Truck lanes */}
              {trucks.map((truck) => (
                <div key={truck.id}>
                  <div className="px-3 py-2 bg-white/[0.02] border-b border-white/[0.06] flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#FF6B00]" />
                    <span className="text-xs font-semibold text-[#E8E4DF]">
                      {truck.name} ({truck.plate_number})
                    </span>
                  </div>
                  <div className="grid grid-cols-7 border-b border-white/[0.06]">
                    {weekDays.map((day) => {
                      const key = formatDateKey(day);
                      const isToday = key === todayKey;
                      const dayBookings =
                        bookingsByDateAndTruck[key]?.[truck.id] ?? [];
                      return (
                        <div
                          key={key}
                          className={`min-h-[100px] p-1.5 border-r border-white/[0.04] last:border-r-0 ${
                            isToday ? 'bg-[#FF6B00]/[0.05] shadow-[inset_0_0_20px_rgba(255,107,0,0.05)]' : ''
                          }`}
                        >
                          {dayBookings.map((booking) => (
                            <button
                              key={booking.id}
                              onClick={() => setSelectedBooking(booking)}
                              className={`w-full text-left rounded-lg border p-1.5 mb-1 text-xs cursor-pointer transition-opacity hover:opacity-80 ${
                                STATUS_COLORS[booking.status] ?? 'bg-white/[0.06] border-white/[0.1] text-white/50'
                              }`}
                            >
                              <p className="font-semibold truncate">
                                {booking.customer?.name ?? 'Customer'}
                              </p>
                              <p className="truncate opacity-80">
                                {TIME_SLOT_INFO[booking.time_slot]?.label}
                              </p>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <div className="space-y-4">
            {trucks.map((truck) => {
              const key = formatDateKey(currentDate);
              const dayBookings =
                bookingsByDateAndTruck[key]?.[truck.id] ?? [];
              return (
                <div key={truck.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-[#FF6B00]" />
                    <span className="text-sm font-semibold text-[#E8E4DF]">
                      {truck.name} ({truck.plate_number})
                    </span>
                  </div>
                  {dayBookings.length === 0 ? (
                    <p className="text-sm text-white/30 pl-6 pb-4">No bookings</p>
                  ) : (
                    <div className="space-y-2 pl-6 pb-4">
                      {dayBookings.map((booking) => (
                        <button
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          className={`w-full text-left rounded-xl border p-3 cursor-pointer transition-opacity hover:opacity-80 ${
                            STATUS_COLORS[booking.status] ?? 'bg-white/[0.06] border-white/[0.1] text-white/50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm">
                                {booking.customer?.name ?? 'Customer'}
                              </p>
                              <p className="text-xs mt-1 opacity-80">
                                {TIME_SLOT_INFO[booking.time_slot]?.label} - {booking.address}
                              </p>
                            </div>
                            <span className="text-sm font-semibold">
                              {formatCurrency(booking.estimated_price)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'month' && (
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 border-b border-white/[0.06]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div
                    key={d}
                    className="px-2 py-2 text-center text-xs font-medium text-white/40 border-r border-white/[0.04] last:border-r-0"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              {Array.from({ length: 6 }).map((_, weekIdx) => {
                const monthDays = getMonthDays(currentDate);
                const rowDays = monthDays.slice(weekIdx * 7, weekIdx * 7 + 7);
                return (
                  <div key={weekIdx} className="grid grid-cols-7 border-b border-white/[0.06] last:border-b-0">
                    {rowDays.map((day) => {
                      const key = formatDateKey(day);
                      const isToday = key === todayKey;
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                      const allBookings = Object.values(bookingsByDateAndTruck[key] ?? {}).flat();
                      return (
                        <div
                          key={key}
                          className={`min-h-[80px] p-1 border-r border-white/[0.04] last:border-r-0 ${
                            isToday ? 'bg-[#FF6B00]/[0.05]' : ''
                          } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                        >
                          <p
                            className={`text-xs font-medium mb-1 ${
                              isToday ? 'text-[#FF6B00] font-bold' : 'text-white/40'
                            }`}
                          >
                            {day.getDate()}
                          </p>
                          {allBookings.slice(0, 2).map((booking) => (
                            <button
                              key={booking.id}
                              onClick={() => setSelectedBooking(booking)}
                              className={`w-full text-left rounded text-[10px] px-1 py-0.5 mb-0.5 truncate cursor-pointer border ${
                                STATUS_COLORS[booking.status] ?? 'bg-white/[0.06] border-white/[0.1]'
                              }`}
                            >
                              {booking.customer?.name ?? 'Customer'}
                            </button>
                          ))}
                          {allBookings.length > 2 && (
                            <p className="text-[10px] text-white/30 px-1">
                              +{allBookings.length - 2} more
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      <Modal
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        maxWidth="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {selectedBooking.customer?.name ?? 'Customer'}
              </h3>
              <Badge variant={statusToBadgeVariant(selectedBooking.status)}>
                {selectedBooking.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Address
                </p>
                <p className="font-medium">{selectedBooking.address}</p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Time Slot
                </p>
                <p className="font-medium">
                  {TIME_SLOT_INFO[selectedBooking.time_slot]?.label} ({TIME_SLOT_INFO[selectedBooking.time_slot]?.description})
                </p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">{selectedBooking.scheduled_date}</p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> Truck
                </p>
                <p className="font-medium">
                  {selectedBooking.truck?.name ?? 'Unassigned'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Waste Types</p>
                <p className="font-medium">
                  {selectedBooking.waste_types
                    .map((wt) => WASTE_TYPE_INFO[wt]?.label)
                    .join(', ')}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Load Size</p>
                <p className="font-medium">
                  {LOAD_SIZE_INFO[selectedBooking.load_size]?.label}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Estimated Price</p>
                <p className="text-lg font-bold text-[#FF6B00]">
                  {formatCurrency(selectedBooking.estimated_price)}
                </p>
              </div>
              {selectedBooking.final_price && (
                <div>
                  <p className="text-gray-500">Final Price</p>
                  <p className="text-lg font-bold text-[#22C55E]">
                    {formatCurrency(selectedBooking.final_price)}
                  </p>
                </div>
              )}
            </div>

            {selectedBooking.special_instructions && (
              <div className="rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/20 p-3">
                <p className="text-xs font-semibold text-[#FFB800] mb-1">
                  Special Instructions
                </p>
                <p className="text-sm text-[#FFB800]/80">
                  {selectedBooking.special_instructions}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
