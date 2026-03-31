import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_PRICING } from '@/lib/pricing';
import type { PricingConfig } from '@/types';

export async function GET() {
  try {
    return NextResponse.json({ pricing: DEFAULT_PRICING }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing config' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<PricingConfig>;

    // Validate required fields
    if (!body.base_rates) {
      return NextResponse.json(
        { error: 'base_rates is required' },
        { status: 400 }
      );
    }

    if (!body.waste_multipliers) {
      return NextResponse.json(
        { error: 'waste_multipliers is required' },
        { status: 400 }
      );
    }

    if (!body.distance_factors) {
      return NextResponse.json(
        { error: 'distance_factors is required' },
        { status: 400 }
      );
    }

    if (!body.frequency_discounts) {
      return NextResponse.json(
        { error: 'frequency_discounts is required' },
        { status: 400 }
      );
    }

    if (body.emergency_surcharge === undefined) {
      return NextResponse.json(
        { error: 'emergency_surcharge is required' },
        { status: 400 }
      );
    }

    // Validate base_rates structure
    const loadSizes = ['light', 'medium', 'heavy', 'full_truck'] as const;
    for (const size of loadSizes) {
      const rate = body.base_rates[size];
      if (!rate || typeof rate.min !== 'number' || typeof rate.max !== 'number') {
        return NextResponse.json(
          { error: `base_rates.${size} must have numeric min and max` },
          { status: 400 }
        );
      }
      if (rate.min < 0 || rate.max < 0) {
        return NextResponse.json(
          { error: `base_rates.${size} values cannot be negative` },
          { status: 400 }
        );
      }
      if (rate.min > rate.max) {
        return NextResponse.json(
          { error: `base_rates.${size}.min cannot exceed max` },
          { status: 400 }
        );
      }
    }

    // Validate emergency surcharge
    if (body.emergency_surcharge < 0 || body.emergency_surcharge > 1) {
      return NextResponse.json(
        { error: 'emergency_surcharge must be between 0 and 1' },
        { status: 400 }
      );
    }

    // Build the validated config (mock — no DB save)
    const newConfig: PricingConfig = {
      id: body.id ?? DEFAULT_PRICING.id,
      version: (body.version ?? DEFAULT_PRICING.version) + 1,
      is_active: true,
      base_rates: body.base_rates,
      waste_multipliers: body.waste_multipliers,
      distance_factors: body.distance_factors,
      frequency_discounts: body.frequency_discounts,
      emergency_surcharge: body.emergency_surcharge,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ pricing: newConfig }, { status: 201 });
  } catch (error) {
    console.error('Error saving pricing config:', error);
    return NextResponse.json(
      { error: 'Failed to save pricing config' },
      { status: 500 }
    );
  }
}
