'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import { useAdminStore } from '@/store/admin';
import { TIME_SLOT_INFO } from '@/types';
import type { TruckStatus } from '@/types';
import { formatCurrency } from '@/lib/constants';
import {
  Truck, Gauge, Calendar, Wrench, MapPin, Clock, Fuel, Plus, X, Save,
} from 'lucide-react';

function truckStatusBadge(status: TruckStatus) {
  return ({ available: { variant: 'completed' as const, label: 'Available' }, in_use: { variant: 'in-progress' as const, label: 'In Use' }, maintenance: { variant: 'cancelled' as const, label: 'Maintenance' } })[status];
}

function bookingStatusBadge(status: string) {
  return ({ scheduled: 'pending', confirmed: 'confirmed', en_route: 'in-progress', arrived: 'in-progress', loading: 'in-progress', completed: 'completed', cancelled: 'cancelled' } as Record<string, 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'default'>)[status] ?? 'default';
}

export default function TrucksPage() {
  const { trucks, bookings, maintenance, fuelLogs, addMaintenanceRecord, addFuelLog } = useAdminStore();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  const [showMaintForm, setShowMaintForm] = useState(false);
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [maintForm, setMaintForm] = useState({ date: todayStr, description: '', cost: '', mileage: '' });
  const [fuelForm, setFuelForm] = useState({ date: todayStr, gallons: '', cost: '', mileage: '' });

  const truckSchedules = useMemo(() => {
    const map: Record<string, typeof bookings> = {};
    for (const truck of trucks) {
      map[truck.id] = bookings.filter((b) => b.truck_id === truck.id && b.scheduled_date === todayStr);
    }
    return map;
  }, [todayStr, trucks, bookings]);

  const truckRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    for (const truck of trucks) {
      map[truck.id] = bookings.filter((b) => b.truck_id === truck.id && b.status === 'completed').reduce((s, b) => s + (b.final_price ?? b.estimated_price), 0);
    }
    return map;
  }, [trucks, bookings]);

  const truckJobCount = useMemo(() => {
    const map: Record<string, number> = {};
    for (const truck of trucks) {
      map[truck.id] = bookings.filter((b) => b.truck_id === truck.id && b.status === 'completed').length;
    }
    return map;
  }, [trucks, bookings]);

  const handleAddMaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTruck || !maintForm.description) return;
    addMaintenanceRecord({ id: `maint-${Date.now()}`, truck_id: selectedTruck, date: maintForm.date, description: maintForm.description, cost: Number(maintForm.cost) || 0, mileage: Number(maintForm.mileage) || 0, created_at: new Date().toISOString() });
    setMaintForm({ date: todayStr, description: '', cost: '', mileage: '' });
    setShowMaintForm(false);
  };

  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTruck || !fuelForm.gallons) return;
    addFuelLog({ id: `fuel-${Date.now()}`, truck_id: selectedTruck, date: fuelForm.date, gallons: Number(fuelForm.gallons), cost: Number(fuelForm.cost) || 0, mileage: Number(fuelForm.mileage) || 0, created_at: new Date().toISOString() });
    setFuelForm({ date: todayStr, gallons: '', cost: '', mileage: '' });
    setShowFuelForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fleet Management</h1>
        <p className="text-white/50 text-sm mt-0.5">Trucks, maintenance, and fuel tracking</p>
      </div>

      {/* Truck cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trucks.map((truck) => {
          const statusInfo = truckStatusBadge(truck.status);
          const todayBookings = truckSchedules[truck.id] ?? [];
          const maintenanceDue = truck.maintenance_due ? new Date(truck.maintenance_due) : null;
          const maintenanceSoon = maintenanceDue && maintenanceDue.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
          const truckMaint = maintenance.filter((m) => m.truck_id === truck.id).sort((a, b) => b.date.localeCompare(a.date));
          const truckFuel = fuelLogs.filter((f) => f.truck_id === truck.id).sort((a, b) => b.date.localeCompare(a.date));
          const isSelected = selectedTruck === truck.id;

          return (
            <div key={truck.id} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-[#FF6B00]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{truck.name}</h2>
                    <p className="text-xs text-white/40">{truck.plate_number} &middot; {truck.notes?.split('—')[0]}</p>
                  </div>
                </div>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-white/[0.04]">
                  <p className="text-sm font-bold">{truck.capacity_tons}T</p>
                  <p className="text-[10px] text-white/40">Capacity</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.04]">
                  <p className="text-sm font-bold">{(truck.mileage / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-white/40">Miles</p>
                </div>
                <div className={`text-center p-2 rounded-lg ${maintenanceSoon ? 'bg-[#FFB800]/10' : 'bg-white/[0.04]'}`}>
                  <p className={`text-sm font-bold ${maintenanceSoon ? 'text-[#FFB800]' : ''}`}>
                    {maintenanceDue ? maintenanceDue.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                  <p className="text-[10px] text-white/40">Service Due</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.04]">
                  <p className="text-sm font-bold text-[#22C55E]">{truckJobCount[truck.id] ?? 0}</p>
                  <p className="text-[10px] text-white/40">Jobs Done</p>
                </div>
              </div>

              {/* Revenue */}
              <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-white/[0.03] mb-4">
                <span className="text-xs text-white/40">Total Revenue</span>
                <span className="text-sm font-bold text-[#22C55E]">{formatCurrency(truckRevenue[truck.id] ?? 0)}</span>
              </div>

              {/* Today's schedule */}
              <div className="border-t border-white/[0.06] pt-3 mb-3">
                <h3 className="text-xs font-semibold text-white/60 flex items-center gap-1.5 mb-2">
                  <Calendar className="h-3.5 w-3.5 text-[#FF6B00]" aria-hidden="true" />
                  Today ({todayBookings.length} jobs)
                </h3>
                {todayBookings.length === 0 ? (
                  <p className="text-xs text-white/30 py-2">No jobs today</p>
                ) : (
                  <div className="space-y-1.5">
                    {todayBookings.map((b) => (
                      <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-center justify-between rounded-lg border border-white/[0.06] p-2 hover:bg-white/[0.04] transition-colors">
                        <div>
                          <p className="text-xs font-medium">{b.customer?.name ?? 'Customer'}</p>
                          <p className="text-[10px] text-white/30">{TIME_SLOT_INFO[b.time_slot]?.label}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={bookingStatusBadge(b.status)}>{b.status.replace('_', ' ')}</Badge>
                          <span className="text-xs font-semibold">{formatCurrency(b.estimated_price)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Expand/collapse for maintenance and fuel */}
              <button
                onClick={() => setSelectedTruck(isSelected ? null : truck.id)}
                className="w-full text-center text-xs text-[#FF6B00] hover:underline py-1"
              >
                {isSelected ? 'Hide details' : 'Show maintenance & fuel logs'}
              </button>

              {isSelected && (
                <div className="mt-3 space-y-4 border-t border-white/[0.06] pt-3">
                  {/* Maintenance Log */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5" aria-hidden="true" /> Maintenance Log
                      </h4>
                      <button onClick={() => setShowMaintForm(!showMaintForm)} className="text-[10px] text-[#FF6B00] flex items-center gap-0.5">
                        <Plus className="h-3 w-3" aria-hidden="true" /> Add
                      </button>
                    </div>
                    {showMaintForm && (
                      <form onSubmit={handleAddMaint} className="grid grid-cols-2 gap-2 mb-2 p-2 rounded-lg bg-white/[0.03]">
                        <input type="date" value={maintForm.date} onChange={(e) => setMaintForm((f) => ({ ...f, date: e.target.value }))} className="rounded bg-white/[0.04] border border-white/[0.08] px-2 py-1.5 text-xs text-white" />
                        <input type="number" placeholder="Cost" value={maintForm.cost} onChange={(e) => setMaintForm((f) => ({ ...f, cost: e.target.value }))} className="rounded bg-white/[0.04] border border-white/[0.08] px-2 py-1.5 text-xs text-white placeholder:text-white/30" />
                        <input type="text" placeholder="Description" value={maintForm.description} onChange={(e) => setMaintForm((f) => ({ ...f, description: e.target.value }))} className="col-span-2 rounded bg-white/[0.04] border border-white/[0.08] px-2 py-1.5 text-xs text-white placeholder:text-white/30" />
                        <button type="submit" className="col-span-2 rounded bg-[#FF6B00] text-white text-xs font-semibold py-1.5">Save</button>
                      </form>
                    )}
                    <div className="space-y-1">
                      {truckMaint.slice(0, 5).map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.03]">
                          <div><span className="text-white/40">{m.date}</span> <span className="ml-2">{m.description}</span></div>
                          <span className="text-[#EF4444] font-medium">{formatCurrency(m.cost)}</span>
                        </div>
                      ))}
                      {truckMaint.length === 0 && <p className="text-[10px] text-white/25">No records</p>}
                    </div>
                  </div>

                  {/* Fuel Log */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5" aria-hidden="true" /> Fuel Log
                      </h4>
                      <button onClick={() => setShowFuelForm(!showFuelForm)} className="text-[10px] text-[#FF6B00] flex items-center gap-0.5">
                        <Plus className="h-3 w-3" aria-hidden="true" /> Add
                      </button>
                    </div>
                    {showFuelForm && (
                      <form onSubmit={handleAddFuel} className="grid grid-cols-3 gap-2 mb-2 p-2 rounded-lg bg-white/[0.03]">
                        <input type="date" value={fuelForm.date} onChange={(e) => setFuelForm((f) => ({ ...f, date: e.target.value }))} className="rounded bg-white/[0.04] border border-white/[0.08] px-2 py-1.5 text-xs text-white" />
                        <input type="number" placeholder="Gallons" value={fuelForm.gallons} onChange={(e) => setFuelForm((f) => ({ ...f, gallons: e.target.value }))} className="rounded bg-white/[0.04] border border-white/[0.08] px-2 py-1.5 text-xs text-white placeholder:text-white/30" />
                        <input type="number" placeholder="Cost" value={fuelForm.cost} onChange={(e) => setFuelForm((f) => ({ ...f, cost: e.target.value }))} className="rounded bg-white/[0.04] border border-white/[0.08] px-2 py-1.5 text-xs text-white placeholder:text-white/30" />
                        <button type="submit" className="col-span-3 rounded bg-[#FF6B00] text-white text-xs font-semibold py-1.5">Save</button>
                      </form>
                    )}
                    <div className="space-y-1">
                      {truckFuel.slice(0, 5).map((f) => (
                        <div key={f.id} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.03]">
                          <div><span className="text-white/40">{f.date}</span> <span className="ml-2">{f.gallons} gal</span></div>
                          <span className="text-[#EF4444] font-medium">{formatCurrency(f.cost)}</span>
                        </div>
                      ))}
                      {truckFuel.length === 0 && <p className="text-[10px] text-white/25">No records</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
