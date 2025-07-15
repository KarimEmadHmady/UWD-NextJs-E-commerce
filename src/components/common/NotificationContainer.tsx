"use client";

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationContainer() {
  const { notifications, remove } = useNotifications();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 max-w-xs w-full items-center">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center px-3 py-2 rounded-lg shadow-md text-white animate-fade-in-down transition-all min-w-[180px] max-w-xs w-full text-sm
            ${n.type === 'success' ? 'bg-pink-600' : ''}
            ${n.type === 'error' ? 'bg-red-600' : ''}
            ${n.type === 'info' ? 'bg-pink-600' : ''}
            ${n.type === 'warning' ? 'bg-yellow-500 text-black' : ''}
          `}
          onClick={() => remove(n.id)}
          style={{ cursor: 'pointer' }}
        >
          {/* أيقونة صغيرة حسب نوع التنبيه */}
          <span className="mr-2">
            {n.type === 'success' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            )}
            {n.type === 'error' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {n.type === 'info' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
            )}
            {n.type === 'warning' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M4.93 19h14.14a2 2 0 0 0 1.74-2.99l-7.07-12.14a2 2 0 0 0-3.48 0L3.19 16.01A2 2 0 0 0 4.93 19z" /></svg>
            )}
          </span>
          <span className="font-semibold capitalize mr-1">{n.type}:</span>
          <span className="truncate flex-1">{n.message}</span>
        </div>
      ))}
    </div>
  );
} 