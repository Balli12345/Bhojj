import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertCircle, DollarSign, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, markNotificationRead } = useApp();

  // Show only unread notifications (up to 2 at a time)
  const unreadList = notifications.filter(n => !n.read).slice(0, 2);
  const unreadIds = unreadList.map(n => n.id).join(',');

  // Auto-dismiss each notification 2 seconds after appearing
  useEffect(() => {
    if (unreadList.length === 0) return;

    const timers = unreadList.map((notif) => {
      return setTimeout(() => {
        markNotificationRead(notif.id);
      }, 2000); // exactly 2 seconds
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [unreadIds, markNotificationRead]);

  if (unreadList.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {unreadList.map((notif, idx) => {
        let icon = <Bell className="w-5 h-5 text-orange-600" />;
        let borderClass = 'border-orange-200 bg-orange-50/95';

        if (notif.type === 'order') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
          borderClass = 'border-emerald-200 bg-emerald-50/95 text-emerald-950';
        } else if (notif.type === 'earnings') {
          icon = <DollarSign className="w-5 h-5 text-blue-600" />;
          borderClass = 'border-blue-200 bg-blue-50/95 text-blue-950';
        } else if (notif.type === 'alert') {
          icon = <AlertCircle className="w-5 h-5 text-amber-600" />;
          borderClass = 'border-amber-200 bg-amber-50/95 text-amber-950';
        }

        return (
          <div
            key={`${notif.id}-${idx}`}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all flex items-start gap-3 relative overflow-hidden ${borderClass} animate-in slide-in-from-bottom-5 duration-200`}
          >
            {/* 2-second visual expiry progress line */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-orange-500/40 w-full animate-[progress_2s_linear_forwards]"
              style={{
                animation: 'toastProgress 2s linear forwards'
              }}
            />

            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h5 className="font-extrabold text-xs text-slate-900 leading-tight">{notif.title}</h5>
                <span className="text-[10px] text-slate-400 font-semibold">2s auto-dismiss</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
            </div>
            <button
              onClick={() => markNotificationRead(notif.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 shrink-0"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

