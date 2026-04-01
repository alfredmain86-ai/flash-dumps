'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import CustomerForm from '@/components/admin/CustomerForm';
import { useAdminStore } from '@/store/admin';

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const { customers } = useAdminStore();
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white/40 text-lg mb-4">Customer not found</p>
        <Link href="/admin/customers" className="text-[#FF6B00] hover:underline text-sm">Back to Customers</Link>
      </div>
    );
  }

  return <CustomerForm customer={customer} />;
}
