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
  onLocationSet: (location: LocationData) => Promise<void>;
  initialLocation?: LocationData | null;
  isChecking?: boolean;
}

const MapWithMarker = dynamic(() => import("./ManualMap"), { ssr: false });

export default function LocationStep({ onLocationSet, initialLocation, isChecking = false }: LocationStepProps) {
  // Default coordinates for Egypt
  const defaultCoords = { latitude: 30.0444, longitude: 31.2357, address: "Cairo, Egypt" };
  const [location, setLocation] = useState<LocationData>(initialLocation || defaultCoords);
  const [manualAddress, setManualAddress] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
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

  // Get location from browser
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
        // Don't call onLocationSet here
      } else {
        setError("Location not found. Try a more specific address.");
      }
    } catch {
      setError("Failed to fetch location. Try again.");
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

  return (
    <div className=" mx-auto space-y-6">
      <div className="text-center mb-5">
        <MapPin className="w-10 h-10 text-teal-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Delivery Location</h2>
        <p className="text-gray-600">
          {isChecking 
            ? "Checking location..." 
            : "Get your location from browser or enter it manually. The map will update automatically."
          }
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4 justify-between w-full">
        <Button onClick={handleGetLocation} className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto">
          <Navigation className="w-4 h-4 mr-2" />
          Get Location from Browser
        </Button>
        <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2 w-full flex-1 relative">
          <div className="w-full flex-1 relative flex items-center">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" /></svg>
            </span>
            <Input
              value={manualAddress}
              onChange={e => setManualAddress(e.target.value)}
              placeholder="Search for your address..."
              className="w-full flex-1 pl-10 text-black border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-lg shadow-sm"
              autoComplete="off"
            />
            {suggestLoading && <div className="absolute right-2 top-2 text-xs text-gray-400">Loading...</div>}
            {suggestions.length > 0 && (
              <ul className="absolute left-0 top-full z-[9999] bg-white border w-full max-h-72 overflow-auto rounded shadow-lg mt-1">
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
          <div className="flex flex-col items-start gap-2 bg-teal-50 rounded-lg shadow p-3 mt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              <span className="font-semibold text-gray-900 break-words">{location.address}</span>
            </div>
            <span className="text-xs text-gray-500 ml-7">Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}</span>
          </div>
          <Button 
            className="w-full bg-teal-600 hover:bg-teal-700 mt-4" 
            onClick={async () => {
              try {
                console.log('onLocationSet called with:', location);
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
                Checking Location...
              </>
            ) : (
              'Confirm Location'
            )}
          </Button>
        </>
      )}
    </div>
  );
}
