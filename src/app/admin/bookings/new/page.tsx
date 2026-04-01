'use client';

import { Suspense } from 'react';
import BookingForm from '@/components/admin/BookingForm';

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="text-white/40">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
