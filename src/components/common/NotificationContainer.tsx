"use client";

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { AnimatePresence, motion } from 'framer-motion';

export default function NotificationContainer() {
  const { notifications, remove } = useNotifications();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 max-w-xs w-full items-center">
      <AnimatePresence>
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center px-3 py-2 rounded-lg shadow-md text-white transition-all min-w-[180px] max-w-xs w-full text-sm
            ${n.type === 'success' ? 'bg-pink-600' : ''}
            ${n.type === 'error' ? 'bg-red-600' : ''}
            ${n.type === 'info' ? 'bg-pink-600' : ''}
            ${n.type === 'warning' ? 'bg-yellow-500 text-black' : ''}
          `}
          onClick={() => remove(n.id)}
          style={{ cursor: 'pointer' }}
        >
          {/* Icon and content */}
          <span>{n.message}</span>
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  );
} 