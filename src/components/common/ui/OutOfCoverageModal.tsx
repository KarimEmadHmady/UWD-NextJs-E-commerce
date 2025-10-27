"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useLocale } from "next-intl";
import ManualMap from "@/components/checkout/ManualMap";

export default function OutOfCoverageModal({ onClose }: { onClose: () => void }) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  // Debounce suggestions
  useEffect(() => {
    if (!search || search.length < 3) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const isAr = /^[\u0600-\u06FF]/.test(search.trim());
        const lang = isAr ? 'ar' : 'en';
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=eg&accept-language=${lang}&q=${encodeURIComponent(search)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
      setSuggestLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // دالة البحث عن عنوان (geocoding) عند الضغط Enter
  async function handleSearchAddress(e: React.FormEvent) {
    e.preventDefault();
    setSearchError("");
    if (!search) return;
    setSearchLoading(true);
    try {
      const isAr = /^[\u0600-\u06FF]/.test(search.trim());
      const lang = isAr ? 'ar' : 'en';
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=eg&accept-language=${lang}&q=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setUserLocation({ latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) });
      } else {
        setSearchError(isArabic ? "لم يتم العثور على العنوان" : "Address not found");
      }
    } catch {
      setSearchError(isArabic ? "حدث خطأ أثناء البحث" : "Error searching address");
    }
    setSearchLoading(false);
  }

  // دالة الحصول على الموقع الحالي
  function handleGetCurrentLocation() {
    setSearchError("");
    if (!navigator.geolocation) {
      setSearchError(isArabic ? "المتصفح لا يدعم تحديد الموقع" : "Geolocation is not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      () => {
        setSearchError(isArabic ? "تعذر الحصول على الموقع الحالي" : "Could not get current location");
      }
    );
  }

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
                              ? "نعتذر عن الإزعاج، نعمل بكل جهد لتوسيع نطاق التوصيل في أقرب وقت ممكن"
                : "We apologize for any inconvenience. We are working to expand our coverage soon."

              }
            </p>
          </div>
        </div>

        {/* New Box: Encourage user to share location */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 flex flex-col items-center">
          <p className="text-gray-900 text-base mb-4">
            {isArabic
              ? "يسعدنا جدًا اهتمامك بخدماتنا 🙏. نود إبلاغك أن خدمتنا غير متاحة حاليًا في موقعك، لكن فريقنا يعمل باستمرار على التوسع. مشاركتك لموقعك هتساعدنا نعرف إن منطقتك من أولوياتنا لفتح فرع جديد قريبًا."
              : "We are very pleased with your interest in our services 🙏. Our service is not currently available at your location, but our team is constantly working to expand. Sharing your location will help us prioritize your area for a new branch soon."
            }
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 mb-2"
            onClick={() => setShowMap(true)}
          >
            {isArabic ? 'أرسل موقعك' : 'Share Your Location'}
          </button>
        </div>

        {/* Available Areas Section */}
        {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
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
        </div> */}

        {/* Apology Message */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            <p className="text-sm text-orange-800">
              {isArabic 
                ? "العنوان الذي اخترته خارج نطاق التغطية الحالي. يُرجى اختيار عنوان ضمن نطاق خدماتنا لمواصلة طلبك"
                : "The address you entered is outside our current service coverage. Please select an address within our available service areas."
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
        {/* Map Modal */}
        {showMap && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                onClick={() => setShowMap(false)}
                aria-label={isArabic ? "إغلاق" : "Close"}
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {isArabic ? 'حدد موقعك على الخريطة' : 'Pin Your Location on the Map'}
              </h3>
              {/* أدوات البحث وتحديد الموقع */}
              <div className="flex flex-col md:flex-row gap-2 mb-4 items-stretch md:items-end relative">
                <form onSubmit={handleSearchAddress} className="flex-1 flex gap-2 relative">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full text-gray-900"
                    placeholder={isArabic ? 'ابحث عن عنوانك...' : 'Search your address...'}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoComplete="off"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" disabled={searchLoading}>
                    {isArabic ? 'بحث' : 'Search'}
                  </button>
                  {/* قائمة الاقتراحات */}
                  {suggestLoading && (
                    <div className="absolute left-0 right-0 top-full bg-white border border-gray-200 rounded shadow z-50 p-2 text-xs text-gray-500">
                      {isArabic ? 'جاري البحث...' : 'Searching...'}
                    </div>
                  )}
                  {suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 top-full bg-white border border-gray-200 rounded shadow z-[9999999] max-h-48 overflow-auto mt-1">
                      {suggestions.map(s => (
                        <li
                          key={s.place_id || s.osm_id || s.lat + s.lon}
                          className="p-2 hover:bg-blue-50 cursor-pointer text-xs text-gray-800 border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSearch(s.display_name);
                            setSuggestions([]);
                            setUserLocation({ latitude: parseFloat(s.lat), longitude: parseFloat(s.lon) });
                          }}
                        >
                          <span className="truncate">{s.display_name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </form>
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded whitespace-nowrap"
                  onClick={handleGetCurrentLocation}
                >
                  {isArabic ? 'احصل على موقعك الحالي' : 'Get Current Location'}
                </button>
              </div>
              {searchError && <div className="text-red-600 mb-2 text-sm">{searchError}</div>}
              <ManualMap
                lat={userLocation?.latitude || 30.0444}
                lng={userLocation?.longitude || 31.2357}
                onChange={(lat, lng) => setUserLocation({ latitude: lat, longitude: lng })}
              />
              <button
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setShowMap(false)}
                disabled={!userLocation}
              >
                {isArabic ? 'تأكيد الموقع' : 'Confirm Location'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 


