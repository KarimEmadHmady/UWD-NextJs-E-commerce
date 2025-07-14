"use client";

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationContainer() {
  const { notifications, remove } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-xs w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center px-4 py-3 rounded shadow-lg text-white animate-fade-in-down transition-all
            ${n.type === 'success' ? 'bg-green-600' : ''}
            ${n.type === 'error' ? 'bg-red-600' : ''}
            ${n.type === 'info' ? 'bg-blue-600' : ''}
            ${n.type === 'warning' ? 'bg-yellow-500 text-black' : ''}
          `}
          onClick={() => remove(n.id)}
          style={{ cursor: 'pointer' }}
        >
          <span className="font-bold capitalize mr-2">{n.type}:</span>
          <span>{n.message}</span>
        </div>
      ))}
    </div>
  );
} 