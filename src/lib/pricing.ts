import type { WasteType, LoadSize, PickupFrequency, PricingConfig, PriceEstimate } from '@/types';

// Default pricing configuration — used when no DB config is available
// Based on FLASH DUMPS LLC real business rates (12 yd³ Isuzu NPR trucks)
// Minimum charge: $150 | Extra weight: $70/ton over 2 tons
export const DEFAULT_PRICING: PricingConfig = {
  id: 'default',
  version: 1,
  is_active: true,
  base_rates: {
    light: { min: 200, max: 250 },       // 1/4 truck (~3 yd³)
    medium: { min: 250, max: 350 },      // 1/2 truck (~6 yd³)
    heavy: { min: 350, max: 500 },       // 3/4 truck (~9 yd³)
    full_truck: { min: 500, max: 650 },  // Full truck (~12 yd³, up to 2 tons)
  },
  waste_multipliers: {
    concrete_brick: 1.0,
    drywall_plaster: 1.0,
    wood_lumber: 1.0,
    metal_rebar: 1.0,
    roofing_shingles: 1.0,
    mixed_debris: 1.0,
    tile_ceramic: 1.0,
    appliances_fixtures: 1.0,
  },
  distance_factors: {
    near: { max_miles: 15, multiplier: 1.0 },
    mid: { max_miles: 30, multiplier: 1.0 },
    far: { max_miles: 999, multiplier: 1.0 },
  },
  frequency_discounts: {
    one_time: 0,
    weekly: 0.15,
    biweekly: 0.10,
    retainer: 0.20,
  },
  emergency_surcharge: 0,
  created_at: new Date().toISOString(),
};

/**
 * Calculate the highest waste multiplier from selected waste types.
 * Uses the max multiplier since mixed loads are charged at the most expensive category.
 */
function getWasteMultiplier(wasteTypes: WasteType[], config: PricingConfig): number {
  if (wasteTypes.length === 0) return 1.0;
  return Math.max(...wasteTypes.map((wt) => config.waste_multipliers[wt] ?? 1.0));
}

/**
 * Determine the distance factor based on miles from base location.
 */
function getDistanceFactor(distanceMiles: number | undefined, config: PricingConfig): number {
  if (!distanceMiles) return 1.0;
  const { near, mid } = config.distance_factors;
  if (distanceMiles <= near.max_miles) return near.multiplier;
  if (distanceMiles <= mid.max_miles) return mid.multiplier;
  return config.distance_factors.far.multiplier;
}

/**
 * Calculate estimated price range for a quote.
 */
export function calculatePrice(params: {
  wasteTypes: WasteType[];
  loadSize: LoadSize;
  distanceMiles?: number;
  frequency: PickupFrequency;
  isEmergency: boolean;
  config?: PricingConfig;
}): PriceEstimate {
  const config = params.config ?? DEFAULT_PRICING;

  const baseRate = config.base_rates[params.loadSize];
  const wasteMultiplier = getWasteMultiplier(params.wasteTypes, config);
  const distanceFactor = getDistanceFactor(params.distanceMiles, config);
  const frequencyDiscount = config.frequency_discounts[params.frequency];
  const emergencySurcharge = params.isEmergency ? config.emergency_surcharge : 0;

  // Calculate: base * waste * distance * (1 - discount) * (1 + emergency)
  const calcPrice = (base: number) => {
    let price = base * wasteMultiplier * distanceFactor;
    price = price * (1 - frequencyDiscount);
    price = price * (1 + emergencySurcharge);
    return Math.round(price);
  };

  const finalMin = calcPrice(baseRate.min);
  const finalMax = calcPrice(baseRate.max);

  const breakdown: { label: string; value: string }[] = [
    { label: 'Base Rate', value: `$${baseRate.min} - $${baseRate.max}` },
  ];

  if (wasteMultiplier !== 1.0) {
    breakdown.push({ label: 'Waste Type Factor', value: `${wasteMultiplier}x` });
  }

  if (distanceFactor !== 1.0) {
    breakdown.push({ label: 'Distance Factor', value: `${distanceFactor}x` });
  }

  if (frequencyDiscount > 0) {
    breakdown.push({ label: 'Frequency Discount', value: `-${frequencyDiscount * 100}%` });
  }

  if (emergencySurcharge > 0) {
    breakdown.push({ label: 'Emergency Surcharge', value: `+${emergencySurcharge * 100}%` });
  }

  return {
    basePrice: baseRate,
    wasteMultiplier,
    distanceFactor,
    frequencyDiscount,
    emergencySurcharge,
    finalMin,
    finalMax,
    breakdown,
  };
}

/**
 * Calculate straight-line distance between two lat/lng points in miles.
 * Uses the Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
