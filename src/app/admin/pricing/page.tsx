'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui';
import { DEFAULT_PRICING } from '@/lib/pricing';
import { calculatePrice } from '@/lib/pricing';
import type { PricingConfig, WasteType, LoadSize, PickupFrequency } from '@/types';
import { WASTE_TYPE_INFO, LOAD_SIZE_INFO, FREQUENCY_INFO } from '@/types';
import { formatCurrency } from '@/lib/constants';
import { Save, RotateCcw, DollarSign } from 'lucide-react';

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig>({ ...DEFAULT_PRICING });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sample quote parameters for live preview
  const [previewWaste, setPreviewWaste] = useState<WasteType>('mixed_debris');
  const [previewLoad, setPreviewLoad] = useState<LoadSize>('medium');
  const [previewFrequency, setPreviewFrequency] = useState<PickupFrequency>('one_time');
  const [previewDistance, setPreviewDistance] = useState(10);
  const [previewEmergency, setPreviewEmergency] = useState(false);

  const preview = useMemo(
    () =>
      calculatePrice({
        wasteTypes: [previewWaste],
        loadSize: previewLoad,
        distanceMiles: previewDistance,
        frequency: previewFrequency,
        isEmergency: previewEmergency,
        config,
      }),
    [config, previewWaste, previewLoad, previewFrequency, previewDistance, previewEmergency]
  );

  const updateBaseRate = (
    size: keyof PricingConfig['base_rates'],
    field: 'min' | 'max',
    value: number
  ) => {
    setConfig((prev) => ({
      ...prev,
      base_rates: {
        ...prev.base_rates,
        [size]: { ...prev.base_rates[size], [field]: value },
      },
    }));
    setSaved(false);
  };

  const updateWasteMultiplier = (wasteType: WasteType, value: number) => {
    setConfig((prev) => ({
      ...prev,
      waste_multipliers: { ...prev.waste_multipliers, [wasteType]: value },
    }));
    setSaved(false);
  };

  const updateDistanceFactor = (
    tier: keyof PricingConfig['distance_factors'],
    field: 'max_miles' | 'multiplier',
    value: number
  ) => {
    setConfig((prev) => ({
      ...prev,
      distance_factors: {
        ...prev.distance_factors,
        [tier]: { ...prev.distance_factors[tier], [field]: value },
      },
    }));
    setSaved(false);
  };

  const updateFrequencyDiscount = (freq: PickupFrequency, value: number) => {
    setConfig((prev) => ({
      ...prev,
      frequency_discounts: { ...prev.frequency_discounts, [freq]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaved(true);
    } catch {
      alert('Failed to save pricing configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig({ ...DEFAULT_PRICING });
    setSaved(false);
  };

  const inputClasses =
    'w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/50';
  const smallInputClasses =
    'w-20 rounded-xl border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-sm text-center text-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/50';
  const selectClasses =
    'w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]/50 [&>option]:bg-[#1a1a1a] [&>option]:text-[#E8E4DF]';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E4DF]">Pricing Configuration</h1>
          <p className="text-white/50 mt-1">
            Configure rates, multipliers, and discounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={handleReset}
          >
            Reset to Default
          </Button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6B00] text-white text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: configuration */}
        <div className="xl:col-span-2 space-y-6">
          {/* Base Rates */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#E8E4DF] mb-5">
              Base Rates by Load Size
            </h2>
            <div className="space-y-4">
              {(Object.keys(config.base_rates) as (keyof PricingConfig['base_rates'])[]).map(
                (size) => (
                  <div
                    key={size}
                    className="grid grid-cols-3 gap-4 items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#E8E4DF]">
                        {LOAD_SIZE_INFO[size]?.label}
                      </p>
                      <p className="text-xs text-white/30">
                        {LOAD_SIZE_INFO[size]?.description}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 mb-1 block">
                        Min ($)
                      </label>
                      <input
                        type="number"
                        value={config.base_rates[size].min}
                        onChange={(e) =>
                          updateBaseRate(size, 'min', Number(e.target.value))
                        }
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 mb-1 block">
                        Max ($)
                      </label>
                      <input
                        type="number"
                        value={config.base_rates[size].max}
                        onChange={(e) =>
                          updateBaseRate(size, 'max', Number(e.target.value))
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Waste Type Multipliers */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#E8E4DF] mb-5">
              Waste Type Multipliers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(config.waste_multipliers) as WasteType[]).map(
                (wasteType) => (
                  <div
                    key={wasteType}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-lg">
                        {WASTE_TYPE_INFO[wasteType]?.icon}
                      </span>
                      <span className="text-sm text-[#E8E4DF] truncate">
                        {WASTE_TYPE_INFO[wasteType]?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <input
                        type="number"
                        step="0.05"
                        min="0.1"
                        max="3"
                        value={config.waste_multipliers[wasteType]}
                        onChange={(e) =>
                          updateWasteMultiplier(wasteType, Number(e.target.value))
                        }
                        className={smallInputClasses}
                      />
                      <span className="text-xs text-white/30">x</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Distance Factors */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#E8E4DF] mb-5">
              Distance Factors
            </h2>
            <div className="space-y-4">
              {(
                Object.keys(config.distance_factors) as (keyof PricingConfig['distance_factors'])[]
              ).map((tier) => (
                <div
                  key={tier}
                  className="grid grid-cols-3 gap-4 items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-[#E8E4DF] capitalize">
                      {tier} Distance
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">
                      Max Miles
                    </label>
                    <input
                      type="number"
                      value={config.distance_factors[tier].max_miles}
                      onChange={(e) =>
                        updateDistanceFactor(
                          tier,
                          'max_miles',
                          Number(e.target.value)
                        )
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">
                      Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.5"
                      max="3"
                      value={config.distance_factors[tier].multiplier}
                      onChange={(e) =>
                        updateDistanceFactor(
                          tier,
                          'multiplier',
                          Number(e.target.value)
                        )
                      }
                      className={inputClasses}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequency Discounts */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#E8E4DF] mb-5">
              Frequency Discounts
            </h2>
            <div className="space-y-4">
              {(
                Object.keys(config.frequency_discounts) as PickupFrequency[]
              ).map((freq) => (
                <div
                  key={freq}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[#E8E4DF]">
                      {FREQUENCY_INFO[freq]?.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={config.frequency_discounts[freq]}
                      onChange={(e) =>
                        updateFrequencyDiscount(freq, Number(e.target.value))
                      }
                      className={smallInputClasses}
                    />
                    <span className="text-xs text-white/30 w-16">
                      ({(config.frequency_discounts[freq] * 100).toFixed(0)}% off)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Surcharge */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#E8E4DF] mb-5">
              Emergency Surcharge
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/50">
                Surcharge for ASAP / emergency pickups
              </p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="2"
                  value={config.emergency_surcharge}
                  onChange={(e) => {
                    setConfig((prev) => ({
                      ...prev,
                      emergency_surcharge: Number(e.target.value),
                    }));
                    setSaved(false);
                  }}
                  className={smallInputClasses}
                />
                <span className="text-xs text-white/30 w-16">
                  (+{(config.emergency_surcharge * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: live preview */}
        <div className="space-y-6">
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-[#E8E4DF] flex items-center gap-2 mb-5">
              <DollarSign className="h-5 w-5 text-[#FF6B00]" />
              Live Quote Preview
            </h2>

            {/* Preview controls */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Waste Type
                </label>
                <select
                  value={previewWaste}
                  onChange={(e) => setPreviewWaste(e.target.value as WasteType)}
                  className={selectClasses}
                >
                  {(Object.keys(WASTE_TYPE_INFO) as WasteType[]).map((wt) => (
                    <option key={wt} value={wt}>
                      {WASTE_TYPE_INFO[wt].icon} {WASTE_TYPE_INFO[wt].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Load Size
                </label>
                <select
                  value={previewLoad}
                  onChange={(e) => setPreviewLoad(e.target.value as LoadSize)}
                  className={selectClasses}
                >
                  {(Object.keys(LOAD_SIZE_INFO) as LoadSize[]).map((ls) => (
                    <option key={ls} value={ls}>
                      {LOAD_SIZE_INFO[ls].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Frequency
                </label>
                <select
                  value={previewFrequency}
                  onChange={(e) =>
                    setPreviewFrequency(e.target.value as PickupFrequency)
                  }
                  className={selectClasses}
                >
                  {(Object.keys(FREQUENCY_INFO) as PickupFrequency[]).map(
                    (freq) => (
                      <option key={freq} value={freq}>
                        {FREQUENCY_INFO[freq].label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  Distance (miles)
                </label>
                <input
                  type="number"
                  value={previewDistance}
                  onChange={(e) => setPreviewDistance(Number(e.target.value))}
                  min={0}
                  max={100}
                  className={inputClasses}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={previewEmergency}
                  onChange={(e) => setPreviewEmergency(e.target.checked)}
                  className="rounded border-white/[0.2] bg-white/[0.04] text-[#FF6B00] focus:ring-[#FF6B00]"
                />
                <span className="text-sm text-white/50">Emergency pickup</span>
              </label>
            </div>

            {/* Preview result */}
            <div className="border-t border-white/[0.06] pt-4">
              <div className="text-center mb-4">
                <p className="text-sm text-white/40">Estimated Price</p>
                <p className="text-3xl font-bold text-[#FF6B00]">
                  {formatCurrency(preview.finalMin)} -{' '}
                  {formatCurrency(preview.finalMax)}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                {preview.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-white/40">{item.label}</span>
                    <span className="font-medium text-[#E8E4DF]">
                      {item.value}
                    </span>
                  </div>
                ))}
                <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between text-sm font-semibold">
                  <span className="text-[#E8E4DF]">Final Range</span>
                  <span className="text-[#FF6B00]">
                    {formatCurrency(preview.finalMin)} -{' '}
                    {formatCurrency(preview.finalMax)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
