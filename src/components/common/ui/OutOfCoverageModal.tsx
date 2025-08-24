"use client";

import React from "react";
import { X, MapPin, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useLocale } from "next-intl";

export default function OutOfCoverageModal({ onClose }: { onClose: () => void }) {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
          onClick={onClose}
          aria-label={isArabic ? "إغلاق" : "Close"}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            {isArabic ? 'العنوان خارج نطاق التغطية' : 'Address Outside Service Area'}
          </h2>
        </div>

        {/* Main Message */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-gray-700 text-base text-right">
              {isArabic 
                ? "العنوان الذي اخترته خارج نطاق التغطية الحالي. يُرجى اختيار عنوان ضمن نطاق خدماتنا لمواصلة طلبك"
                : "The address you entered is outside our current service coverage. Please select an address within our available service areas."
              }
            </p>
          </div>
        </div>

        {/* Available Areas Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-3 gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-800 text-lg">
              {isArabic ? 'مناطق الخدمة المتاحة' : 'Available Service Areas'}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-100 text-green-800 rounded-lg px-3 py-2 text-sm font-medium">
              {isArabic ? 'المهندسين' : 'Mohandessin'}
            </div>
            <div className="bg-green-100 text-green-800 rounded-lg px-3 py-2 text-sm font-medium">
              {isArabic ? 'مصر الجديدة' : 'Heliopolis'}
            </div>
            <div className="bg-green-100 text-green-800 rounded-lg px-3 py-2 text-sm font-medium">
              {isArabic ? 'التجمع ' : 'Settlement'}
            </div>

          </div>
        </div>

        {/* Apology Message */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            <p className="text-sm text-orange-800">
              {isArabic 
                ? "نعتذر عن الإزعاج، نعمل بكل جهد لتوسيع نطاق التوصيل في أقرب وقت ممكن"
                : "We apologize for any inconvenience. We are working to expand our coverage soon."
              }
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          {isArabic ? 'فهمت، سأختار عنوان آخر' : 'Got it, I\'ll choose another address'}
        </button>
      </div>
    </div>
  );
} 


