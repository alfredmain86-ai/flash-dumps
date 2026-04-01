'use client';

import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminBottomTabs from '@/components/layout/AdminBottomTabs';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import NotificationBell from '@/components/layout/NotificationBell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark">
      <div className="flex h-screen overflow-hidden bg-[#0F0F0F] min-h-screen text-[#E8E4DF]">
        <AdminSidebar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto lg:ml-60"
        >
          {/* Top bar with notification bell */}
          <div className="sticky top-0 z-30 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/[0.04] px-4 lg:px-8 py-2 flex items-center justify-end">
            <NotificationBell />
          </div>
          <div className="p-4 lg:p-8 pb-24 lg:pb-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
        <AdminBottomTabs />
      </div>
    </div>
  );
}
