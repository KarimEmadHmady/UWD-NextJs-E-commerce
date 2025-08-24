"use client"

import { useState, useEffect } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "../common/Button/Button";
import { Input } from "../common/input/input";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import OutOfCoverageModal from '../common/ui/OutOfCoverageModal';
import { useLocale } from "next-intl";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationStepProps {
  onLocationSet: (location: LocationData) => Promise<void>;
  initialLocation?: LocationData | null;
  isChecking?: boolean;
  forceOutOfCoverageModal?: boolean;
  onCloseOutOfCoverageModal?: () => void;
}

const MapWithMarker = dynamic(() => import("./ManualMap"), { ssr: false });

export default function LocationStep({ onLocationSet, initialLocation, isChecking = false, forceOutOfCoverageModal = false, onCloseOutOfCoverageModal }: LocationStepProps) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  
  // Default coordinates for Egypt
  const defaultCoords = { latitude: 30.0444, longitude: 31.2357, address: "Cairo, Egypt" };
  const [location, setLocation] = useState<LocationData>(initialLocation || defaultCoords);
  const [manualAddress, setManualAddress] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [showOutOfCoverageModal, setShowOutOfCoverageModal] = useState(false);
  // Debounce search suggestions
  useEffect(() => {
    if (manualAddress.length < 3) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const isArabic = /^[\u0600-\u06FF]/.test(manualAddress.trim());
        const lang = isArabic ? 'ar' : 'en';
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=eg&accept-language=${lang}&q=${encodeURIComponent(manualAddress)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
      setSuggestLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [manualAddress]);

  // On mount, if initialLocation exists, fill location
  useEffect(() => {
    if (initialLocation) setLocation(initialLocation);
  }, [initialLocation]);

  // في الأماكن التي يظهر فيها الخطأ "outside our service area" أو ما شابه
  useEffect(() => {
    if (error && (error.includes('outside our service area') || error.includes('Out of coverage'))) {
      setShowOutOfCoverageModal(true);
    }
  }, [error]);

  // Get location from browser
  const handleGetLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError(isArabic ? "متصفحك لا يدعم تحديد الموقع الجغرافي" : "Geolocation is not supported by this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            address = data.display_name;
          }
        } catch {}
        const loc = { latitude, longitude, address };
        setLocation(loc);
        // لا تستدعي onLocationSet هنا
      },
      (error) => {
        setError(isArabic ? "فشل في الحصول على الموقع من المتصفح" : "Failed to get location from browser");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  // البحث عن عنوان يدوي وتحويله لإحداثيات
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setManualLoading(true);
    try {
      const isArabic = /^[\u0600-\u06FF]/.test(manualAddress.trim());
      const lang = isArabic ? 'ar' : 'en';
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=eg&accept-language=${lang}&q=${encodeURIComponent(manualAddress)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        let address = data[0].display_name || manualAddress;
        const loc = { latitude, longitude, address };
        setLocation(loc);
        // Don't call onLocationSet here
      } else {
        setError(isArabic ? "لم يتم العثور على العنوان. جرب عنواناً أكثر تحديداً." : "Location not found. Try a more specific address.");
      }
    } catch {
      setError(isArabic ? "فشل في البحث عن العنوان. حاول مرة أخرى." : "Failed to fetch location. Try again.");
    }
    setManualLoading(false);
  };

  // When moving the marker on the map
  const handleMapChange = async (lat: number, lng: number) => {
    let address = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        address = data.display_name;
      }
    } catch {}
    const loc = { latitude: lat, longitude: lng, address };
    setLocation(loc);
    // onLocationSet(loc); // This line is removed as per the edit hint
  };

  // إذا تم تمرير forceOutOfCoverageModal من الأعلى، أظهر البوب أب مباشرة
  const showModal = forceOutOfCoverageModal || showOutOfCoverageModal;

  return (
    <div className=" mx-auto space-y-6">
      <div className="text-center mb-5">
        <MapPin className="w-10 h-10 text-red-600 mx-auto mb-4" />
        <h2 className="text-1xl sm:text-2xl font-bold text-gray-900 mb-2">
          {isArabic ? 'حدد موقع التوصيل الخاص بك' : 'Set Your Delivery Location'}
        </h2>
        <p className="text-gray-600">
          {isChecking 
            ? (isArabic ? "جاري فحص الموقع..." : "Checking location...")
            : (isArabic 
                ? "احصل على موقعك من المتصفح أو أدخله يدوياً. ستحدث الخريطة تلقائياً."
                : "Get your location from browser or enter it manually. The map will update automatically."
              )
          }
        </p>
      </div>
      {/* Get Current Location Button */}
      <Button onClick={handleGetLocation} className="bg-blue-600 hover:bg-blue-700 w-full py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
          <Navigation className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {isArabic ? 'احصل على موقعك الحالي' : 'Get Your Current Location'}
      </Button>
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 p-4 bg-red-100 rounded-lg">
      
        {/* Search Form */}
        <form onSubmit={handleManualSubmit} className="w-full relative">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:border-red-300 focus-within:border-red-500 transition-all duration-200">
            <div className={`flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {isArabic ? 'ابحث عن عنوانك' : 'Search for your address'}
                </h3>
              </div>
            </div>
            
            <div className="relative">
              <div className={`absolute inset-y-0 ${isArabic ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                value={manualAddress}
                onChange={e => setManualAddress(e.target.value)}
                placeholder={isArabic ? "مثال: شارع النيل، المعادي، القاهرة" : "e.g., Nile Street, Maadi, Cairo"}
                className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 sm:py-3 border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-lg transition-all duration-200 text-sm sm:text-base ${isArabic ? 'text-right' : 'text-left'}`}
                autoComplete="off"
              />
            </div>
            
            {suggestLoading && (
              <div className={`absolute ${isArabic ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400`}>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">{isArabic ? 'جاري البحث...' : 'Searching...'}</span>
              </div>
            )}
            
            {suggestions.length > 0 && (
              <ul className="absolute left-0 top-full z-[9999] bg-white border-2 border-gray-200 w-full max-h-48 sm:max-h-72 overflow-auto rounded-lg shadow-lg mt-2">
                {suggestions.map(s => (
                  <li
                    key={s.place_id}
                    className={`p-2.5 sm:p-3 hover:bg-red-50 cursor-pointer text-xs sm:text-sm font-medium text-gray-800 border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${isArabic ? 'text-right' : 'text-left'}`}
                    onClick={() => {
                      setManualAddress(s.display_name);
                      setSuggestions([]);
                      const loc = {
                        latitude: parseFloat(s.lat),
                        longitude: parseFloat(s.lon),
                        address: s.display_name
                      };
                      setLocation(loc);
                    }}
                  >
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></div>
                      <span className="truncate">{s.display_name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            <div className={`mt-2 sm:mt-3 text-xs text-gray-500 text-center ${isArabic ? 'text-right' : 'text-left'}`}>
              {isArabic 
                ? '💡 نصيحة: اكتب العنوان بالتفصيل للحصول على نتائج أدق'
                : '💡 Tip: Write the address in detail for more accurate results'
              }
            </div>
          </div>
        </form>
        
        {/* Confirm Button */}
        <Button 
          type="submit" 
          className="bg-red-600 hover:bg-red-700 w-full py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer" 
          disabled={manualLoading}
          onClick={async () => {
            try {
              await onLocationSet(location);
            } catch (error) {
              console.error('Error setting location:', error);
            }
          }}
        >
          {manualLoading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span>{isArabic ? 'جاري فحص الموقع...' : 'Checking Location...'}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{isArabic ? 'تأكيد الموقع' : 'Confirm Location'}</span>
            </>
          )}
        </Button>
      </div>
      {showModal && (
        <OutOfCoverageModal onClose={onCloseOutOfCoverageModal || (() => setShowOutOfCoverageModal(false))} />
      )}
      {/* احذف أو عطل إظهار رسالة الخطأ النصية العادية إذا كان showModal ظاهرًا */}
      {!showModal && error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {/* Map always shows */}
      <div className="mb-2 w-full h-[215px] rounded overflow-hidden">
        <MapWithMarker
          lat={location.latitude}
          lng={location.longitude}
          onChange={handleMapChange}
        />
      </div>
      {/* Don't show address or confirm button unless a non-default address is selected */}
      {location.address !== defaultCoords.address && (
        <>
          <div className="flex flex-col items-start gap-2 bg-red-50 rounded-lg shadow p-3 mt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-gray-900 break-words">{location.address}</span>
            </div>
            <span className="text-xs text-gray-500 ml-7">
              {isArabic ? 'خط العرض' : 'Lat'}: {location.latitude.toFixed(5)}, {isArabic ? 'خط الطول' : 'Lng'}: {location.longitude.toFixed(5)}
            </span>
          </div>
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 mt-4 cursor-pointer" 
            onClick={async () => {
              try {
                await onLocationSet(location);
              } catch (error) {
                console.error('Error setting location:', error);
              }
            }}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isArabic ? 'جاري فحص الموقع...' : 'Checking Location...'}
              </>
            ) : (
              isArabic ? 'تأكيد الموقع' : 'Confirm Location'
            )}
          </Button>
        </>
      )}
    </div>
  );
}
