'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui';
import { useAdminStore } from '@/store/admin';
import { TIME_SLOT_INFO } from '@/types';
import type { TruckStatus } from '@/types';
import { formatCurrency } from '@/lib/constants';
import {
  Truck,
  Gauge,
  Calendar,
  Wrench,
  MapPin,
  Clock,
} from 'lucide-react';

function truckStatusBadge(status: TruckStatus) {
  const map: Record<TruckStatus, { variant: 'completed' | 'in-progress' | 'cancelled'; label: string }> = {
    available: { variant: 'completed', label: 'Available' },
    in_use: { variant: 'in-progress', label: 'In Use' },
    maintenance: { variant: 'cancelled', label: 'Maintenance' },
  };
  return map[status];
}

function bookingStatusBadge(status: string) {
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

export default function TrucksPage() {
  const { trucks: MOCK_TRUCKS, bookings: MOCK_BOOKINGS } = useAdminStore();
  const todayStr = new Date().toISOString().split('T')[0];

  const truckSchedules = useMemo(() => {
    const map: Record<string, typeof MOCK_BOOKINGS> = {};
    for (const truck of MOCK_TRUCKS) {
      map[truck.id] = MOCK_BOOKINGS.filter(
        (b) => b.truck_id === truck.id && b.scheduled_date === todayStr
      );
    }
    return map;
  }, [todayStr, MOCK_TRUCKS, MOCK_BOOKINGS]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#E8E4DF]">Trucks</h1>
        <p className="text-white/50 mt-1">
          Fleet management and daily assignments
        </p>
      </div>

      {/* Truck cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_TRUCKS.map((truck) => {
          const statusInfo = truckStatusBadge(truck.status);
          const todayBookings = truckSchedules[truck.id] ?? [];
          const maintenanceDue = truck.maintenance_due
            ? new Date(truck.maintenance_due)
            : null;
          const maintenanceSoon =
            maintenanceDue &&
            maintenanceDue.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

          return (
            <div key={truck.id} className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
              {/* Truck header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
                    <Truck className="h-7 w-7 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#E8E4DF]">
                      {truck.name}
                    </h2>
                    <p className="text-sm text-white/40">
                      Plate: {truck.plate_number}
                    </p>
                  </div>
                </div>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>

              {/* Truck specs */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-xl bg-white/[0.04]">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Gauge className="h-4 w-4 text-white/30" />
                  </div>
                  <p className="text-lg font-bold text-[#E8E4DF]">
                    {truck.capacity_tons}T
                  </p>
                  <p className="text-xs text-white/40">Capacity</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.04]">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-white/30" />
                  </div>
                  <p className="text-lg font-bold text-[#E8E4DF]">
                    {(truck.mileage / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-white/40">Miles</p>
                </div>
                <div
                  className={`text-center p-3 rounded-xl ${
                    maintenanceSoon
                      ? 'bg-[#FFB800]/10 border border-[#FFB800]/20'
                      : 'bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Wrench
                      className={`h-4 w-4 ${
                        maintenanceSoon ? 'text-[#FFB800]' : 'text-white/30'
                      }`}
                    />
                  </div>
                  <p
                    className={`text-sm font-bold ${
                      maintenanceSoon ? 'text-[#FFB800]' : 'text-[#E8E4DF]'
                    }`}
                  >
                    {maintenanceDue
                      ? maintenanceDue.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-white/40">Maintenance</p>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/40">Capacity</span>
                  <span className="text-xs font-medium text-[#E8E4DF]">12 yd³</span>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#FF6B00] to-[#FFB800] h-2 rounded-full transition-all"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Notes */}
              {truck.notes && (
                <p className="text-sm text-white/40 mb-4 italic">
                  {truck.notes}
                </p>
              )}

              {/* Today's schedule */}
              <div className="border-t border-white/[0.06] pt-4">
                <h3 className="text-sm font-semibold text-[#E8E4DF] flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-[#FF6B00]" />
                  Today&apos;s Schedule
                  <span className="text-xs font-normal text-white/30">
                    ({todayBookings.length} jobs)
                  </span>
                </h3>

                {todayBookings.length === 0 ? (
                  <p className="text-sm text-white/30 text-center py-4">
                    No jobs scheduled for today
                  </p>
                ) : (
                  <div className="space-y-2">
                    {todayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-[#E8E4DF] truncate">
                              {booking.customer?.name ?? 'Customer'}
                            </p>
                            <Badge variant={bookingStatusBadge(booking.status)}>
                              {booking.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-white/30 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {TIME_SLOT_INFO[booking.time_slot]?.label}
                            </span>
                            <span className="text-xs text-white/30 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.address.split(',')[0]}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-[#E8E4DF] ml-3 flex-shrink-0">
                          {formatCurrency(booking.estimated_price)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
