import React from "react";
import { X } from "lucide-react";

export default function OutOfCoverageModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Address Outside Service Area</h2>
        <p className="text-gray-700 mb-4 text-base">
          The address you entered is outside our current service coverage.<br />
          Please select an address within our available service areas.
        </p>
        <div className="bg-teal-50 rounded-lg p-3 mb-2">
          <div className="font-semibold text-teal-700 mb-1">Available Service Areas:</div>
          <ul className="flex flex-wrap gap-2 justify-center">
            <li className="bg-teal-600 text-white rounded-full px-3 py-1 text-xs font-bold">Mohandessin</li>
            <li className="bg-teal-600 text-white rounded-full px-3 py-1 text-xs font-bold">Heliopolis</li>
            {/* Add more areas here */}
          </ul>
        </div>
        <div className="text-xs text-gray-500 mt-2">We apologize for any inconvenience. We are working to expand our coverage soon.</div>
      </div>
    </div>
  );
} 