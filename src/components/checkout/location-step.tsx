"use client"

import { useState, useEffect } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "../common/Button/Button";
import { Input } from "../common/input/input";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationStepProps {
  onLocationSet: (location: LocationData) => void;
  initialLocation?: LocationData | null;
}

const MapWithMarker = dynamic(() => import("./ManualMap"), { ssr: false });

export default function LocationStep({ onLocationSet, initialLocation }: LocationStepProps) {
  // إحداثيات مصر افتراضياً
  const defaultCoords = { latitude: 30.0444, longitude: 31.2357, address: "Cairo, Egypt" };
  const [location, setLocation] = useState<LocationData>(initialLocation || defaultCoords);
  const [manualAddress, setManualAddress] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  // Debounce البحث عن اقتراحات
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

  // عند mount، إذا كان initialLocation موجود، املأ location
  useEffect(() => {
    if (initialLocation) setLocation(initialLocation);
  }, [initialLocation]);

  // جلب اللوكيشن من المتصفح
  const handleGetLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
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
        setError("Failed to get location from browser");
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
        // لا تستدعي onLocationSet هنا
      } else {
        setError("Location not found. Try a more specific address.");
      }
    } catch {
      setError("Failed to fetch location. Try again.");
    }
    setManualLoading(false);
  };

  // عند تحريك الماركر على الخريطة
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-5">
        <MapPin className="w-10 h-10 text-teal-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Delivery Location</h2>
        <p className="text-gray-600">Get your location from browser or enter it manually. The map will update automatically.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <Button onClick={handleGetLocation} className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto">
          <Navigation className="w-4 h-4 mr-2" />
          Get Location from Browser
        </Button>
        <form onSubmit={handleManualSubmit} className="flex gap-2 w-full md:w-auto relative">
          <div className="w-full relative">
            <Input
              value={manualAddress}
              onChange={e => setManualAddress(e.target.value)}
              placeholder="Enter your address manually"
              className="w-full"
              autoComplete="off"
            />
            {suggestLoading && <div className="absolute right-2 top-2 text-xs text-gray-400">Loading...</div>}
            {suggestions.length > 0 && (
              <ul className="absolute z-[2000] bg-white border w-full min-w-[300px] max-h-72 overflow-auto rounded shadow-lg mt-1">
                {suggestions.map(s => (
                  <li
                    key={s.place_id}
                    className="p-2 hover:bg-teal-100 cursor-pointer text-sm font-medium text-gray-800"
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
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700 px-3" disabled={manualLoading}>
            {manualLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set Address"}
          </Button>
        </form>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {/* الخريطة تظهر دائماً */}
      <div className="mb-2 w-full h-[215px] rounded overflow-hidden">
        <MapWithMarker
          lat={location.latitude}
          lng={location.longitude}
          onChange={handleMapChange}
        />
      </div>
      {/* لا تظهر العنوان أو زر التأكيد إلا إذا تم اختيار عنوان غير الافتراضي */}
      {location.address !== defaultCoords.address && (
        <>
          <div className="flex flex-col items-start gap-2 bg-teal-50 rounded-lg shadow p-3 mt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              <span className="font-semibold text-gray-900 break-words">{location.address}</span>
            </div>
            <span className="text-xs text-gray-500 ml-7">Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}</span>
          </div>
          <Button className="w-full bg-teal-600 hover:bg-teal-700 mt-4" onClick={() => onLocationSet(location)}>
            Confirm Location
          </Button>
        </>
      )}
    </div>
  );
}
