import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mockQuotes } from '@/lib/mock-data';
import { calculatePrice } from '@/lib/pricing';
import type { QuoteFormData, Quote, QuoteStatus, WasteType, LoadSize, PickupFrequency, TimeSlot } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as QuoteStatus | null;

    let quotes = [...mockQuotes];

    if (status) {
      quotes = quotes.filter((q) => q.status === status);
    }

    return NextResponse.json({ quotes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Support both JSON and FormData submissions
    const contentType = request.headers.get('content-type') ?? '';
    let wasteTypes: WasteType[];
    let loadSize: string;
    let address: string;
    let frequency: string;
    let isEmergency: boolean;
    let customerName: string;
    let customerEmail: string;
    let customerPhone: string;
    let preferredDate: string | undefined;
    let timeSlot: string | undefined;
    let notes: string | undefined;
    let lat: number | undefined;
    let lng: number | undefined;
    let distanceMiles: number | undefined;

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      wasteTypes = JSON.parse(formData.get('wasteTypes') as string ?? '[]');
      loadSize = formData.get('loadSize') as string ?? '';
      address = formData.get('address') as string ?? '';
      frequency = formData.get('frequency') as string ?? 'one_time';
      isEmergency = formData.get('isEmergency') === 'true';
      customerName = formData.get('customerName') as string ?? '';
      customerEmail = formData.get('customerEmail') as string ?? '';
      customerPhone = formData.get('customerPhone') as string ?? '';
      preferredDate = formData.get('preferredDate') as string | undefined;
      timeSlot = formData.get('timeSlot') as string | undefined;
      notes = formData.get('notes') as string | undefined;
      const latStr = formData.get('lat') as string | null;
      const lngStr = formData.get('lng') as string | null;
      lat = latStr ? parseFloat(latStr) : undefined;
      lng = lngStr ? parseFloat(lngStr) : undefined;
    } else {
      const body = await request.json();
      wasteTypes = body.wasteTypes ?? [];
      loadSize = body.loadSize ?? '';
      address = body.address ?? '';
      frequency = body.frequency ?? 'one_time';
      isEmergency = body.isEmergency ?? false;
      customerName = body.customerName ?? '';
      customerEmail = body.customerEmail ?? '';
      customerPhone = body.customerPhone ?? '';
      preferredDate = body.preferredDate;
      timeSlot = body.timeSlot;
      notes = body.notes;
      lat = body.lat;
      lng = body.lng;
      distanceMiles = body.distanceMiles;
    }

    if (!wasteTypes || wasteTypes.length === 0) {
      return NextResponse.json(
        { error: 'At least one waste type is required' },
        { status: 400 }
      );
    }

    if (!loadSize) {
      return NextResponse.json(
        { error: 'Load size is required' },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Customer name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Calculate price estimate
    const priceEstimate = calculatePrice({
      wasteTypes: wasteTypes as WasteType[],
      loadSize: loadSize as LoadSize,
      frequency: (frequency ?? 'one_time') as PickupFrequency,
      isEmergency: isEmergency ?? false,
      distanceMiles,
    });

    const now = new Date().toISOString();

    const quoteId = uuidv4();
    const newQuote: Quote = {
      id: quoteId,
      reference: `FD-${new Date().getFullYear()}-${quoteId.slice(0, 3).toUpperCase()}`,
      activity_log: [{ id: uuidv4(), content: 'Quote created', created_at: now, author: 'System' }],
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      waste_types: wasteTypes as WasteType[],
      load_size: loadSize as LoadSize,
      address,
      lat,
      lng,
      frequency: (frequency ?? 'one_time') as PickupFrequency,
      preferred_date: preferredDate,
      time_slot: timeSlot as TimeSlot | undefined,
      is_emergency: isEmergency ?? false,
      photo_urls: [],
      estimated_price_min: priceEstimate.finalMin,
      estimated_price_max: priceEstimate.finalMax,
      status: 'new',
      notes,
      created_at: now,
      updated_at: now,
    };

    return NextResponse.json(
      { quote: newQuote, priceEstimate },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}
