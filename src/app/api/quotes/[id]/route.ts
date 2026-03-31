import { NextRequest, NextResponse } from 'next/server';
import { mockQuotes } from '@/lib/mock-data';
import type { QuoteStatus } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quote = mockQuotes.find((q) => q.id === id);

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quote }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
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

    const quote = mockQuotes.find((q) => q.id === id);

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    const { status, admin_adjusted_price, notes } = body as {
      status?: QuoteStatus;
      admin_adjusted_price?: number;
      notes?: string;
    };

    // Validate status if provided
    const validStatuses: QuoteStatus[] = [
      'new', 'reviewed', 'priced', 'sent', 'accepted', 'booked', 'expired',
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (admin_adjusted_price !== undefined && admin_adjusted_price < 0) {
      return NextResponse.json(
        { error: 'Adjusted price cannot be negative' },
        { status: 400 }
      );
    }

    // Build updated quote (mock — no DB persistence)
    const updatedQuote = {
      ...quote,
      ...(status && { status }),
      ...(admin_adjusted_price !== undefined && { admin_adjusted_price }),
      ...(notes !== undefined && { notes }),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ quote: updatedQuote }, { status: 200 });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}
