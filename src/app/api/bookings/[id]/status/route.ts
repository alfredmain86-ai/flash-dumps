import { NextRequest, NextResponse } from 'next/server';
import { mockBookings } from '@/lib/mock-data';
import type { BookingStatus } from '@/types';

/**
 * Quick status update endpoint for drivers (mobile view).
 * Only accepts a status field in the body.
 */
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

    const { status } = body as { status: BookingStatus };

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      );
    }

    const validStatuses: BookingStatus[] = [
      'scheduled', 'confirmed', 'en_route', 'arrived', 'loading', 'completed', 'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate status transitions for drivers
    const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
      scheduled: ['confirmed', 'cancelled'],
      confirmed: ['en_route', 'cancelled'],
      en_route: ['arrived', 'cancelled'],
      arrived: ['loading', 'cancelled'],
      loading: ['completed'],
      completed: [],
      cancelled: [],
    };

    const currentStatus = booking.status;
    const allowed = allowedTransitions[currentStatus] ?? [];

    if (!allowed.includes(status)) {
      return NextResponse.json(
        {
          error: `Cannot transition from '${currentStatus}' to '${status}'. Allowed: ${allowed.join(', ') || 'none'}`,
        },
        { status: 422 }
      );
    }

    const updatedBooking = {
      ...booking,
      status,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ booking: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
