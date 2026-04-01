'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, X, Check } from 'lucide-react';
import { useAdminStore } from '@/store/admin';

export default function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount } = useAdminStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = unreadNotificationCount();

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const typeIcon: Record<string, string> = {
    quote: '📋', booking: '📦', payment: '💰', maintenance: '🔧', invoice: '🧾',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5 text-white/60" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#FF6B00] text-[10px] font-bold text-white flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] overflow-y-auto rounded-xl bg-[#1A1A1A] border border-white/[0.08] shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[10px] text-[#FF6B00] hover:underline flex items-center gap-1"
                  aria-label="Mark all as read"
                >
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 text-white/30 hover:text-white/60" aria-label="Close notifications">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-white/30">No notifications</p>
          ) : (
            <div>
              {notifications.slice(0, 20).map((n) => (
                <div key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => { markNotificationRead(n.id); setOpen(false); }}
                      className={`block px-4 py-3 hover:bg-white/[0.04] transition-colors ${!n.read ? 'bg-white/[0.02]' : ''}`}
                    >
                      <NotifContent n={n} typeIcon={typeIcon} />
                    </Link>
                  ) : (
                    <div
                      onClick={() => markNotificationRead(n.id)}
                      className={`px-4 py-3 cursor-pointer hover:bg-white/[0.04] transition-colors ${!n.read ? 'bg-white/[0.02]' : ''}`}
                    >
                      <NotifContent n={n} typeIcon={typeIcon} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotifContent({ n, typeIcon }: { n: { type: string; title: string; message: string; read: boolean; created_at: string }; typeIcon: Record<string, string> }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base mt-0.5" aria-hidden="true">{typeIcon[n.type] ?? '📌'}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold ${!n.read ? 'text-white' : 'text-white/60'}`}>{n.title}</p>
        <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
        <p className="text-[10px] text-white/25 mt-1">
          {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>
      {!n.read && <div className="h-2 w-2 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" aria-label="Unread" />}
    </div>
  );
}
