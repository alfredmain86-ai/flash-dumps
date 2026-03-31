import { NextResponse } from 'next/server';
import { mockTrucks } from '@/lib/mock-data';

export async function GET() {
  try {
    return NextResponse.json({ trucks: mockTrucks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching trucks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trucks' },
      { status: 500 }
    );
  }
}
