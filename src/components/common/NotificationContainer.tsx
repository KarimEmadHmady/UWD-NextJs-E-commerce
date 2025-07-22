"use client";

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

export default function NotificationContainer() {
  const { notifications, remove } = useNotifications();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center w-auto min-w-fit">
      <AnimatePresence>
      {notifications.map((n) => {
        let Icon = Info;
        if (n.type === 'success') Icon = CheckCircle;
        if (n.type === 'error') Icon = XCircle;
        if (n.type === 'warning') Icon = AlertTriangle;
        return (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md text-white transition-all w-auto min-w-fit text-sm
              ${n.type === 'success' ? 'bg-teal-600' : ''}
              ${n.type === 'error' ? 'bg-red-600' : ''}
              ${n.type === 'info' ? 'bg-teal-600' : ''}
              ${n.type === 'warning' ? 'bg-yellow-500 text-black' : ''}
            `}
            onClick={() => remove(n.id)}
            style={{ cursor: 'pointer' }}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${n.type === 'warning' ? 'text-black' : 'text-white'}`} />
            <span className="whitespace-pre-line text-center">{n.message}</span>
          </motion.div>
        )
      })}
      </AnimatePresence>
    </div>
  );
} 