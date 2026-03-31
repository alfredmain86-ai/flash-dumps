import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mockBookings, mockQuotes } from '@/lib/mock-data';
import type { Booking, BookingStatus, TimeSlot } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const truckId = searchParams.get('truck_id');
    const status = searchParams.get('status') as BookingStatus | null;

    let bookings = [...mockBookings];

    if (date) {
      bookings = bookings.filter((b) => b.scheduled_date === date);
    }

    if (truckId) {
      bookings = bookings.filter((b) => b.truck_id === truckId);
    }

    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { quote_id, truck_id, scheduled_date, time_slot } = body as {
      quote_id: string;
      truck_id: string;
      scheduled_date: string;
      time_slot: TimeSlot;
    };

    // Validate required fields
    if (!quote_id) {
      return NextResponse.json(
        { error: 'quote_id is required' },
        { status: 400 }
      );
    }

    if (!truck_id) {
      return NextResponse.json(
        { error: 'truck_id is required' },
        { status: 400 }
      );
    }

    if (!scheduled_date) {
      return NextResponse.json(
        { error: 'scheduled_date is required' },
        { status: 400 }
      );
    }

    if (!time_slot) {
      return NextResponse.json(
        { error: 'time_slot is required' },
        { status: 400 }
      );
    }

    const validTimeSlots: TimeSlot[] = ['morning', 'afternoon', 'emergency'];
    if (!validTimeSlots.includes(time_slot)) {
      return NextResponse.json(
        { error: `Invalid time_slot. Must be one of: ${validTimeSlots.join(', ')}` },
        { status: 400 }
      );
    }

    // Look up the quote for booking details
    const quote = mockQuotes.find((q) => q.id === quote_id);

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    const newBooking: Booking = {
      id: uuidv4(),
      quote_id,
      customer_id: quote.customer_id ?? uuidv4(),
      truck_id,
      scheduled_date,
      time_slot,
      status: 'scheduled',
      address: quote.address,
      lat: quote.lat,
      lng: quote.lng,
      waste_types: quote.waste_types,
      load_size: quote.load_size,
      estimated_price: quote.admin_adjusted_price ?? quote.estimated_price_max,
      completion_photos: [],
      created_at: now,
      updated_at: now,
    };

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
