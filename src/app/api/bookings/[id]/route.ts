import { NextRequest, NextResponse } from 'next/server';
import { mockBookings } from '@/lib/mock-data';
import type { BookingStatus } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = mockBookings.find((b) => b.id === id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const booking = mockBookings.find((b) => b.id === id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const {
      status,
      driver_notes,
      actual_weight,
      final_price,
      special_instructions,
      completion_photos,
    } = body as {
      status?: BookingStatus;
      driver_notes?: string;
      actual_weight?: number;
      final_price?: number;
      special_instructions?: string;
      completion_photos?: string[];
    };

    // Validate status if provided
    const validStatuses: BookingStatus[] = [
      'scheduled', 'confirmed', 'en_route', 'arrived', 'loading', 'completed', 'cancelled',
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (actual_weight !== undefined && actual_weight < 0) {
      return NextResponse.json(
        { error: 'Actual weight cannot be negative' },
        { status: 400 }
      );
    }

    if (final_price !== undefined && final_price < 0) {
      return NextResponse.json(
        { error: 'Final price cannot be negative' },
        { status: 400 }
      );
    }

    // Build updated booking (mock — no DB persistence)
    const updatedBooking = {
      ...booking,
      ...(status && { status }),
      ...(driver_notes !== undefined && { driver_notes }),
      ...(actual_weight !== undefined && { actual_weight }),
      ...(final_price !== undefined && { final_price }),
      ...(special_instructions !== undefined && { special_instructions }),
      ...(completion_photos && { completion_photos }),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ booking: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
